import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { UserStatus } from '@/config/constants';
import { IUser, toSafeUser } from '@/models/User';
import { getMongoCollection, updateById } from '@/lib/mongo';
import { withErrorHandler } from '@/lib/error';
import { encodeJWT } from '@/lib/jwt';
import { responseHandler } from "@/lib/response";

interface LoginRequestBody {
  email: string;
  password: string;
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body: LoginRequestBody = await req.json();
  const { email, password } = body;

  // Validate required fields
  if (!email || !password) {
    return responseHandler.failure(
      'Email and password are required',
      'Validation Error',
      400
    );
  }

  // Find user by email
  const usersCollection = await getMongoCollection<IUser>('users');
  const user = await usersCollection.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!user) {
    return responseHandler.failure(
      'Invalid email or password',
      'Authentication Failed',
      401
    );
  }

  // Check if user is active
  if (user.status !== UserStatus.ACTIVE) {
    const message =
      user.status === UserStatus.BANNED
        ? 'Your account has been banned'
        : 'Your account is inactive';

    return responseHandler.failure(message, 'Access Denied', 403);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return responseHandler.failure(
      'Invalid email or password',
      'Authentication Failed',
      401
    );
  }

  // Update last login timestamp
  await updateById<IUser>('users', user._id!, {
    lastLoginAt: new Date(),
  });

  // Generate JWT
  const token = await encodeJWT({
    userId: user._id!.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const safeUser = toSafeUser(user);

  return responseHandler.success(
    {
      token,
      user: safeUser,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    'Login successful',
    200
  );
});