import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '@/config/constants';
import { CreateUserDTO, IUser, toSafeUser } from '@/models/User';
import { getMongoCollection, insertOne } from '@/lib/mongo';
import { withErrorHandler } from '@/lib/error';
import { responseHandler } from "@/lib/response";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body: CreateUserDTO = await req.json();
  const { name, email, password, phone } = body;

  // Validate required fields
  if (!name || !email || !password) {
    return responseHandler.failure(
      'Name, email, and password are required',
      'Validation Error',
      400
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return responseHandler.failure(
      'Invalid email format',
      'Validation Error',
      400
    );
  }

  // Validate password strength
  if (password.length < 8) {
    return responseHandler.failure(
      'Password must be at least 8 characters',
      'Validation Error',
      400
    );
  }

  const usersCollection = await getMongoCollection<IUser>('users');

  // Check for duplicate email
  const existingUser = await usersCollection.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    return responseHandler.failure(
      'User with this email already exists',
      'Conflict',
      409
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user with auto-timestamps
  const newUser = await insertOne<IUser>('users', {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: [UserRole.USER],
    status: UserStatus.ACTIVE,
    phone: phone?.trim(),
    isEmailVerified: false,
  });

  return responseHandler.success(
    { user: toSafeUser(newUser) },
    'User registered successfully',
    201
  );
});