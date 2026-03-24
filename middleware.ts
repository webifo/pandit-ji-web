import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

type JWTPayload = jose.JWTPayload & {
  role?: string;
  userId?: string;
  email?: string;
};

/**
 * Verify JWT and extract user payload
 */
const verifyToken = async (token: string): Promise<JWTPayload | null> => {
  try {
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload as JWTPayload;
  } catch (err) {
    console.error("Token verification error:", (err as Error).message);
    return null;
  }
};

/**
 * CORS Headers - Allow All Origins
 */
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, company_id, timezone, x-app-identifier",
};

/**
 * Users Middleware
 */
const customMiddleware = async (
  req: NextRequest,
  role: string | null,
): Promise<NextResponse> => {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: "Authentication required" }),
      { status: 403, headers: corsHeaders },
    );
  }

  const user = await verifyToken(token);

  if (!user) {
    return new NextResponse(
      JSON.stringify({ error: "Invalid or expired token" }),
      { status: 401, headers: corsHeaders },
    );
  }

  if (role && user?.role !== role) {
    return new NextResponse(
      JSON.stringify({
        error: `Access denied: ${role.toLowerCase().replaceAll("_", " ")} only`,
      }),
      { status: 403, headers: corsHeaders },
    );
  }

  return NextResponse.next();
};

/**
 * General Middleware Routing
 */
export async function middleware(req: NextRequest): Promise<NextResponse> {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/public")) {
    return NextResponse.next();
  }

  return await customMiddleware(req, null);
}

/**
 * Apply middleware only for API routes
 */
export const config = {
  matcher: ["/api/:path*"],
};
