import { NextRequest, NextResponse } from 'next/server';

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

export const withErrorHandler = (handler: RouteHandler): RouteHandler => {
  return async (req: NextRequest): Promise<NextResponse> => {
    let responseBody: unknown;
    let statusCode = 200;

    try {
      const response = await handler(req);
      
      responseBody = await response.clone().json().catch(async () => {
        try {
              return await response.clone().text();
          } catch {
              return null;
          }
      });
      
      statusCode = response.status;

      return response;
    } catch (error) {
      const err = error as Error;
      console.error('Route handler error:', err);

      statusCode = 500;
      responseBody = { error: 'Internal server error' };

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
};