import { NextRequest } from "next/server";
import { insertOne, findOne, findMany } from "@/lib/mongo";
import { withErrorHandler } from "@/lib/error";
import { responseHandler } from "@/lib/response";
import { checkAppSecret } from "@/lib/jwt";
import { IWeather, CreateWeatherDTO } from "@/models/Weather";

// ─── Constants ────────────────────────────────────────────────────────────────

const WEATHER_API_BASE = "https://api.weatherapi.com/v1";
const CACHE_TTL_MS = 30 * 60 * 1000;
const DEFAULT_QUERY = "Kathmandu";
const DEFAULT_DAYS = 3;

// ─── Helper: build WeatherAPI URL ────────────────────────────────────────────

const buildUrl = (
  endpoint: "current" | "forecast",
  q: string,
  days: number,
  aqi: boolean,
): string => {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey)
    throw new Error("WEATHER_API_KEY is not set in environment variables");

  const url = new URL(`${WEATHER_API_BASE}/${endpoint}.json`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", q);
  url.searchParams.set("aqi", aqi ? "yes" : "no");

  if (endpoint === "forecast") {
    url.searchParams.set("days", String(days));
    url.searchParams.set("alerts", "no");
  }

  return url.toString();
};

// ─── Route ────────────────────────────────────────────────────────────────────

/**
 * GET /api/weather
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  if (!checkAppSecret(req)) {
    return responseHandler.failure("Unauthorized", "Forbidden", 401);
  }

  const url = new URL(req.url);
  const query = (url.searchParams.get("q") ?? DEFAULT_QUERY).trim();

  // ── Cache check ─────────────────────────────────────────────────────────────
  const cached = await findOne<IWeather>("weather", {
    query,
    forecast_days: DEFAULT_DAYS,
    fetchedAt: { $gte: new Date(Date.now() - CACHE_TTL_MS) },
  });

  if (cached) {
    return responseHandler.success(
      cached,
      `Weather cache hit for "${query}"`,
      200,
    );
  }

  // ── Fetch from WeatherAPI ────────────────────────────────────────────────────
  try {
    const forecastUrl = buildUrl("forecast", query, DEFAULT_DAYS, true);

    const res = await fetch(forecastUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const message =
        (errBody as any)?.error?.message ??
        `WeatherAPI responded with ${res.status}`;
      throw new Error(message);
    }

    const data = (await res.json()) as {
      location: IWeather["location"];
      current: IWeather["current"] & { air_quality?: IWeather["air_quality"] };
      forecast?: { forecastday: IWeather["forecast"] };
    };

    // ── Normalise ─────────────────────────────────────────────────────────────
    const { air_quality, ...currentWithoutAqi } = data.current;

    const record: CreateWeatherDTO = {
      query,
      location: data.location,
      current: currentWithoutAqi,
      ...(air_quality ? { air_quality } : {}),
      forecast: data.forecast?.forecastday ?? [],
      forecast_days: DEFAULT_DAYS,
      source: "weatherapi.com",
      fetchedAt: new Date(),
    };

    const saved = await insertOne<IWeather>("weather", record);

    return responseHandler.success(
      saved,
      `Weather fetched & saved for "${data.location.name}, ${data.location.country}" (${DEFAULT_DAYS}d forecast)`,
      201,
    );
  } catch (error: any) {
    console.error("Weather fetch error:", error);

    const fallback = await findMany<IWeather>(
      "weather",
      { query },
      { sort: { fetchedAt: -1 } },
    );

    if (fallback.length > 0) {
      return responseHandler.success(
        fallback[0],
        `Fallback weather data for "${query}" (stale)`,
        200,
      );
    }

    return responseHandler.failure(
      error.message ?? "Unknown error",
      "Failed to fetch weather data",
      500,
    );
  }
});
