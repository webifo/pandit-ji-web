import { NextRequest } from 'next/server';
import * as jose from 'jose';
import { UserRole } from '@/config/constants';

export interface DecodedUser {
  userId: string;
  email: string;
  role: UserRole[];
  name: string;
}

const getSecretKey = (): Uint8Array => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error('JWT_SECRET_KEY is not defined in environment variables');
  }
  return new TextEncoder().encode(secret);
};

/**
 * Generate a JWT token for a user
 */
export const encodeJWT = async (user: DecodedUser): Promise<string> => {
  const secretKey = getSecretKey();
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const token = await new jose.SignJWT({
    userId: user.userId,
    email: user.email,
    role: user.role,
    name: user.name,
  } as jose.JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);

  return token;
};

/**
 * Decode and verify a JWT token
 */
export const decodeJWT = async (token: string): Promise<DecodedUser | null> => {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jose.jwtVerify(token, secretKey);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as UserRole[],
      name: payload.name as string,
    };
  } catch {
    return null;
  }
};

/**
 * Extract and verify user from request Authorization header
 */
export const getReqUser = async (req: NextRequest): Promise<DecodedUser | null> => {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return null;
  }

  return await decodeJWT(token);
};

/**
 * Extract token from Authorization header (for manual verification)
 */
export const getTokenFromHeader = (req: NextRequest): string | null => {
  const authHeader = req.headers.get('Authorization');
  return authHeader?.split(' ')[1] ?? null;
};

/**
 * Check App Secret
 */
export const checkAppSecret = (req: NextRequest): boolean => {
  const authorization = req.headers.get('Authorization');
  return authorization === `Bearer ${process.env.PANDIT_JI_APP_SECRET}`;
};