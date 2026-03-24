import { NextRequest } from "next/server";
import { insertOne, findOne, findMany } from "@/lib/mongo";
import { withErrorHandler } from "@/lib/error";
import { IRashifal, IRashifalLang } from "@/models/Rashifal";
import { responseHandler } from "@/lib/response";
import { checkAppSecret } from "@/lib/jwt";
import { RashifalType } from "@/models/type";

const RASHI_NAMES: Record<string, IRashifalLang> = {
  aries: { en: "Aries", np: "मेष" },
  taurus: { en: "Taurus", np: "वृष" },
  gemini: { en: "Gemini", np: "मिथुन" },
  cancer: { en: "Cancer", np: "कर्क" },
  leo: { en: "Leo", np: "सिंह" },
  virgo: { en: "Virgo", np: "कन्या" },
  libra: { en: "Libra", np: "तुला" },
  scorpio: { en: "Scorpio", np: "वृश्चिक" },
  sagittarius: { en: "Sagittarius", np: "धनु" },
  capricorn: { en: "Capricorn", np: "मकर" },
  aquarius: { en: "Aquarius", np: "कुम्भ" },
  pisces: { en: "Pisces", np: "मीन" },
};

const TYPE_TITLES: Record<RashifalType, IRashifalLang> = {
  'd': { en: 'Daily Rashifal', np: 'दैनिक राशिफल' },
  'w': { en: 'Weekly Rashifal', np: 'साप्ताहिक राशिफल' },
  'm': { en: 'Monthly Rashifal', np: 'मासिक राशिफल' },
  'y': { en: 'Yearly Rashifal', np: 'वार्षिक राशिफल' }
};

const RASHI_KEYS = Object.keys(RASHI_NAMES);

export const GET = withErrorHandler(async (req: NextRequest) => {
  if (!checkAppSecret(req)) {
    return responseHandler.failure("Unauthorized", "Forbidden", 401);
  }

  const url = new URL(req.url);
  const type: RashifalType =
    (url.searchParams.get("type") as RashifalType) || "d";

  const recentMatch = await findOne<IRashifal>("rashifal", {
    type,
    fetchedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
  });

  if (recentMatch) {
    return responseHandler.success(
      recentMatch,
      `${type.toUpperCase()} - Cache hit (1hr)`,
      200,
    );
  }

  try {
    const npRes = await fetch(
      `https://nepalipatro.com.np/rashifal/getv5/type/${type}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!npRes.ok) throw new Error(`Nepali API failed: ${npRes.status}`);

    const npData = (await npRes.json()) as any;

    const enRes = await fetch(
      `https://nepalipatro.com.np/rashifal/getv5/type/${type}?lang=en`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!enRes.ok) throw new Error(`English API failed: ${enRes.status}`);

    const enData = (await enRes.json()) as any;

    const rashifalDate = new Date(npData.np[0].todate);
    const rashifalItems: IRashifal["rashifal"] = [];

    const npItem = Array.isArray(npData.np) ? npData.np[0] : npData.np;
    const enItem = Array.isArray(enData.np) ? enData.np[0] : enData.np;

    RASHI_KEYS.forEach((rashiKey) => {
      const npDesc = npItem[rashiKey];
      const enDesc = enItem[rashiKey];

      if (npDesc || enDesc) {
        rashifalItems.push({
          rashi: RASHI_NAMES[rashiKey],
          description: {
            np: npDesc?.trim() || '',
            en: enDesc?.trim() || ''
          }
        });
      }
    });

    if (rashifalItems.length === 0) {
      throw new Error("No rashifal items found");
    }

    const titleLang: IRashifalLang = {
      en: TYPE_TITLES[type.toLowerCase() as RashifalType]?.en,
      np: TYPE_TITLES[type.toLowerCase() as RashifalType]?.np,
    };

    const authorLang: IRashifalLang = {
      en: enData.author?.en || npData.author?.en || "Nepali Patro",
      np: npData.author?.np || enData.author?.np || "नेपाली पात्रो",
    };

    const recordData: IRashifal = {
      type,
      date: rashifalDate,
      title: titleLang,
      author: authorLang,
      rashifal: rashifalItems,
      source: "nepalipatro.com.np",
      fetchedAt: new Date(),
    };

    const newRecord = await insertOne<IRashifal>("rashifal", recordData);

    return responseHandler.success(
      newRecord,
      `${type.toUpperCase()} rashifal (NP+EN) fetched & saved (${rashifalItems.length} rashis)`,
      201,
    );
  } catch (error: any) {
    console.error(`❌ ${type} rashifal fetch failed:`, error);

    const fallbacks = await findMany<IRashifal>(
      "rashifal",
      { type },
      {
        sort: { fetchedAt: -1 },
        limit: 1,
      },
    );

    const fallback = fallbacks[0];

    if (fallback) {
      return responseHandler.success(
        fallback,
        `Fallback ${type.toUpperCase()} rashifal (NP+EN)`,
        200,
      );
    }

    return responseHandler.failure(
      error.message || "Unknown error",
      "Failed to fetch rashifal",
      500,
    );
  }
});
