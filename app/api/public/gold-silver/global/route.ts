import { NextRequest } from "next/server";
import { insertOne, findMany } from "@/lib/mongo";
import { withErrorHandler } from "@/lib/error";
import { IGlobalRates } from "@/models/GlobalRates";
import { responseHandler } from "@/lib/response";
import { checkAppSecret } from "@/lib/jwt";

export const GET = withErrorHandler(async (req: NextRequest) => {
  if (!checkAppSecret(req)) {
    return responseHandler.failure("Unauthorized", "Forbidden", 401);
  }

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const recentRecords = await findMany<IGlobalRates>(
    "global_rates",
    { fetchedAt: { $gte: oneHourAgo } },
    { sort: { fetchedAt: -1 }, limit: 1 },
  );

  if (recentRecords.length > 0) {
    const last = recentRecords[0];
    return responseHandler.success(
      {
        ...last,
        cached: true,
        message: "Data fetched from cache (less than 1 hour old)",
      },
      "Global rates retrieved successfully",
      200,
    );
  }

  try {
    const res = await fetch("https://data-asg.goldprice.org/dbXRates/USD", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const item = json?.items?.[0];

    if (!item) {
      throw new Error("No data in response");
    }

    const data = {
      curr: "USD",
      xauPrice: item.xauPrice,
      xagPrice: item.xagPrice,
      chgXau: item.chgXau,
      chgXag: item.chgXag,
      pcXau: item.pcXau,
      pcXag: item.pcXag,
      xauClose: item.xauClose,
      xagClose: item.xagClose,
      source: "goldprice.org",
      fetchedAt: now,
    };

    await insertOne<IGlobalRates>("global_rates", data);

    return responseHandler.success(
      {
        ...data,
        cached: false,
        message: "Fresh data fetched and saved",
      },
      "Global rates fetched successfully",
      201,
    );
  } catch (error) {
    console.error("Global rates fetch error:", error);

    const lastRecord = await findMany<IGlobalRates>(
      "global_rates",
      {},
      { sort: { fetchedAt: -1 }, limit: 1 },
    );

    if (lastRecord.length > 0) {
      const last = lastRecord[0];
      return responseHandler.success(
        {
          ...last,
          cached: true,
          message: "Returning cached data (fetch failed)",
        },
        "Global rates retrieved from cache",
        200,
      );
    }

    return responseHandler.failure(error, "Failed to fetch global rates", 500);
  }
});
