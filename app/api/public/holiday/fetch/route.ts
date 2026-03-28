import { NextRequest } from "next/server";
import { insertMany, findMany } from "@/lib/mongo";
import { withErrorHandler } from "@/lib/error";
import { IHoliday } from "@/models/Holiday";
import { responseHandler } from "@/lib/response";
import { checkAppSecret } from "@/lib/jwt";

export const GET = withErrorHandler(async (req: NextRequest) => {
    if (!checkAppSecret(req)) {
        return responseHandler.failure("Unauthorized", "Forbidden", 401);
    }

    const url = new URL(req.url);
    const year = url.searchParams.get("year") || "2082";
    const bsYear = parseInt(year);

    // 1. Check if year exists
    const holidays = await findMany<IHoliday>("holidays", { bs_year: bsYear }, {
        sort: { date: 1 }
    });

    if (holidays.length > 0) {
        return responseHandler.success(
            holidays,
            `Holidays ${year} already exists (${holidays.length} records)`,
            200,
        );
    }

    try {
        // 2. Fetch from API
        const apiUrl = `https://api.nepalipatro.com.np/goverment-holidays/${bsYear}`;
        const res = await fetch(apiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Accept: "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) throw new Error(`API failed: ${res.status}`);

        const rawHolidays = await res.json() as any[];

        if(!Array.isArray(rawHolidays) || rawHolidays.length === 0) {
            throw new Error("API returned no holidays");
        }

        // 3. Parse & dedupe (Updated for IHolidayLang description)

        const holidayMap = new Map<string, IHoliday>();

        for (const raw of rawHolidays) {
            const key = `${raw.ad}-${raw.title}`;

            let descObj: any = {};
            try {
                if (typeof raw.description === 'string') {
                    descObj = JSON.parse(raw.description);
                }
            } catch { }

            const baseHoliday: IHoliday = {
                ad: raw.ad,
                bs: raw.bs,
                date: new Date(raw.ad),
                title: {
                    en: descObj.en || raw.title,
                    np: raw.title
                },
                description: descObj.ne && descObj.en ? {
                    en: descObj.en,
                    np: descObj.ne
                } : undefined,
                holiday_type: "Public",
                image_small_url: descObj.image_small_url,
                bs_year: bsYear,
                based_on: [],
                source: "nepalipatro.com.np",
                fetchedAt: new Date(),
            };

            if (holidayMap.has(key)) {
                const existing = holidayMap.get(key)!;
                if (!existing.based_on!.includes(raw.based_on)) {
                    existing.based_on!.push(raw.based_on);
                }
            } else {
                baseHoliday.based_on!.push(raw.based_on);
                holidayMap.set(key, baseHoliday);
            }
        }

        const holidays: IHoliday[] = Array.from(holidayMap.values());

        if (holidays.length === 0) {
            throw new Error("No holidays found");
        }

        // 4. Bulk insert
        await insertMany<IHoliday>("holidays", holidays);

        return responseHandler.success(
            holidays,
            `Holidays ${year} (NP+EN) fetched & saved (${holidays.length} events)`,
            201,
        );

    } catch (error: any) {
        const fallbacks = await findMany<IHoliday>(
            "holidays",
            { bs_year: bsYear - 1 },
            { sort: { date: 1 } }
        );

        if (fallbacks.length > 0) {
            return responseHandler.success(
                fallbacks,
                `Fallback Holidays ${year}`,
                200,
            );
        }

        return responseHandler.failure(
            error.message || "Unknown error",
            "Failed to fetch holidays",
            500,
        );
    }
});