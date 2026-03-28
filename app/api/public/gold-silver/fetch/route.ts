import { NextRequest } from 'next/server';
import { insertOne, findMany } from '@/lib/mongo';
import { withErrorHandler } from '@/lib/error';
import { IGoldSilver } from '@/models/GoldSilver';
import { responseHandler } from "@/lib/response";
import { checkAppSecret } from "@/lib/jwt";

export const GET = withErrorHandler(async (req: NextRequest) => {
  if (!checkAppSecret(req)) {
    return responseHandler.failure(
      'Unauthorized',
      'Forbidden',
      401
    );
  }

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const recentRecords = await findMany<IGoldSilver>(
    'gold_silver',
    { fetchedAt: { $gte: oneHourAgo } },
    { sort: { fetchedAt: -1 }, limit: 1 }
  );

  if (recentRecords.length > 0) {
    const lastRecord = recentRecords[0];
    return responseHandler.success(
      {
        gold: lastRecord.gold,
        silver: lastRecord.silver,
        fetchedAt: lastRecord.fetchedAt,
        cached: true,
        message: 'Data fetched from cache (less than 1 hour old)',
      },
      'Gold/Silver rates retrieved successfully',
      200
    );
  }

  try {
    const res = await fetch('https://www.hamropatro.com/gold', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const html = await res.text();

    const liMatches = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    const items = liMatches.map(m =>
      m[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(),
    );

    let gold: number | null = null;
    let silver: number | null = null;

    for (let i = 0; i < items.length; i++) {
      const text = items[i];
      
      if (text.includes('Gold Hallmark') && text.includes('tola')) {
        for (let j = 1; j <= 3; j++) {
          const nextText = items[i + j] ?? '';
          const match = nextText.match(/([\d,]+\.?\d*)/);
          if (match) {
            gold = parseFloat(match[1].replace(/,/g, ''));
            break;
          }
        }
      }
      
      if (text.includes('Silver') && text.includes('tola')) {
        for (let j = 1; j <= 3; j++) {
          const nextText = items[i + j] ?? '';
          const match = nextText.match(/([\d,]+\.?\d*)/);
          if (match) {
            silver = parseFloat(match[1].replace(/,/g, ''));
            break;
          }
        }
      }
    }

    if (gold === null && silver === null) {
      throw new Error('Failed to parse gold/silver prices from HTML');
    }

    const newRecord = await insertOne<IGoldSilver>('gold_silver', {
      gold,
      silver,
      source: 'hamropatro.com',
      fetchedAt: now,
    });

    return responseHandler.success(
      {
        gold: newRecord.gold,
        silver: newRecord.silver,
        fetchedAt: newRecord.fetchedAt,
        cached: false,
        message: 'Fresh data fetched and saved',
      },
      'Gold/Silver rates fetched successfully',
      201
    );
  } catch (error) {
    console.error('Gold/Silver fetch error:', error);
    const lastRecord = await findMany<IGoldSilver>(
      'gold_silver',
      {},
      { sort: { fetchedAt: -1 }, limit: 1 }
    );

    if (lastRecord.length > 0) {
      return responseHandler.success(
        {
          gold: lastRecord[0].gold,
          silver: lastRecord[0].silver,
          fetchedAt: lastRecord[0].fetchedAt,
          cached: true,
          message: 'Returning cached data (fetch failed)',
        },
        'Gold/Silver rates retrieved from cache',
        200
      );
    }

    return responseHandler.failure(
      error,
      'Failed to fetch gold/silver rates',
      500
    );
  }
});