import { NextRequest } from "next/server";
import { insertMany, findMany } from "@/lib/mongo";
import { withErrorHandler } from "@/lib/error";
import { responseHandler } from "@/lib/response";
import { checkAppSecret } from "@/lib/jwt";
import { ISait, ISaitTiming } from "@/models/Sait";
import NepaliDate from "nepali-date-converter";
import { decodeSaitResponse } from "@/lib/crypto";

export const GET = withErrorHandler(async (req: NextRequest) => {
    if (!checkAppSecret(req)) {
        return responseHandler.failure("Unauthorized", "Forbidden", 401);
    }

    const url = new URL(req.url);
    const year = url.searchParams.get("year");
    const bsYear = parseInt(year ?? "2082");

    const saits = await findMany<ISait>("sait", { bs_year: bsYear }, { sort: { date: 1 } });

    if (saits.length > 0) {
        return responseHandler.success(saits, `Sait for ${bsYear} already exists`, 200);
    }

    try {
        const apiUrl = `https://api.nepalipatro.com.np/sait/getv5?year=${bsYear}`;
        const res = await fetch(apiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Accept: "text/plain",
            },
            cache: "no-store",
        });

        if (!res.ok) throw new Error(`API failed: ${res.status}`);

        const rawHexResponse = await res.text();
        const decodedJson = decodeSaitResponse(rawHexResponse);

        const yearData = decodedJson[String(bsYear)];
        if (!yearData) throw new Error(`No data found for year ${bsYear}`);

        const dateMap = new Map<string, ISaitTiming[]>();

        for (const typeLabel of Object.keys(yearData)) {
            const [typeEn, typeNp] = typeLabel.split("~");
            const monthsData = yearData[typeLabel];

            for (const monthStr of Object.keys(monthsData)) {
                const month = parseInt(monthStr);
                const daysData = monthsData[monthStr];

                for (const dayStr of Object.keys(daysData)) {
                    const day = parseInt(dayStr);

                    const bsDate = `${bsYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                    if (!dateMap.has(bsDate)) {
                        dateMap.set(bsDate, []);
                    }

                    dateMap.get(bsDate)!.push({
                        type: typeEn.toLowerCase().replace(/\s+/g, "_"),
                        title: {
                            en: typeEn.trim(),
                            np: typeNp?.trim() ?? typeEn.trim(),
                        },
                    });
                }
            }
        }

        if (dateMap.size === 0) {
            throw new Error("No sait entries found for the given year");
        }

        const saits: ISait[] = [];

        for (const [bsDate, timings] of dateMap.entries()) {
            const [y, m, d] = bsDate.split("-").map(Number);

            let adDate = "";
            try {
                const nepaliDate = new NepaliDate(y, m - 1, d);
                const jsDate = nepaliDate.toJsDate();
                const adY = jsDate.getFullYear();
                const adM = String(jsDate.getMonth() + 1).padStart(2, "0");
                const adD = String(jsDate.getDate()).padStart(2, "0");
                adDate = `${adY}-${adM}-${adD}`;
            } catch {
                adDate = "";
            }

            saits.push({
                ad: adDate,
                bs: bsDate,
                date: new Date(adDate),
                bs_year: bsYear,
                timings,
                source: "nepalipatro.com.np",
                fetchedAt: new Date(),
            });
        }

        saits.sort((a, b) => a.date.getTime() - b.date.getTime());

        await insertMany<ISait>("sait", saits);

        return responseHandler.success(
            saits,
            `Sait for ${bsYear} saved (${saits.length} entries)`,
            201,
        );

    } catch (error: any) {
        console.error("Sait fetch error:", error);
        return responseHandler.failure(
            error.message || "Unknown error",
            "Failed to fetch sait",
            500,
        );
    }
});
