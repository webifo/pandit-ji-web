import { NextResponse } from 'next/server';

interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error?: string;
}

const setHeaders = (response: NextResponse): NextResponse => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, company_id, timezone, x-app-identifier'
  );
  return response;
};

export const responseHandler = {
  success: <T = unknown>(
    data: T,
    message = 'Success',
    statusCode = 200
  ): NextResponse<ApiResponse<T>> => {
    const body: ApiResponse<T> = {
      success: true,
      status: statusCode,
      message,
      data,
    };

    const response = NextResponse.json(body, { status: statusCode });
    return setHeaders(response) as NextResponse<ApiResponse<T>>;
  },

  failure: (
    error: unknown,
    message = 'Failure',
    statusCode = 500
  ): NextResponse<ApiResponse<null>> => {
    const errorMessage =
      error instanceof Error ? error.message : String(error);

    const body: ApiResponse<null> = {
      success: false,
      status: statusCode,
      message,
      error: errorMessage,
    };

    const response = NextResponse.json(body, { status: statusCode });
    return setHeaders(response) as NextResponse<ApiResponse<null>>;
  },
};