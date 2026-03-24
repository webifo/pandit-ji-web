import { NextRequest } from 'next/server';
import { UserStatus } from '@/config/constants';
import { IUser, UpdateUserDTO, toSafeUser } from '@/models/User';
import { updateById, findById } from '@/lib/mongo';
import { withErrorHandler } from '@/lib/error';
import { getReqUser } from '@/lib/jwt';
import { responseHandler } from "@/lib/response";

// GET /api/private/me
export const GET = withErrorHandler(async (req: NextRequest) => {
  const currentUser = await getReqUser(req);

  if (!currentUser?.userId) {
    return responseHandler.failure(
      'User not authenticated',
      'Unauthorized',
      401
    );
  }

  const user = await findById<IUser>('users', currentUser.userId);

  if (!user) {
    return responseHandler.failure(
      'User not found',
      'Not Found',
      404
    );
  }

  return responseHandler.success(
    { user: toSafeUser(user) },
    'Profile retrieved successfully'
  );
});

// PUT /api/private/me
export const PUT = withErrorHandler(async (req: NextRequest) => {
  const currentUser = await getReqUser(req);

  if (!currentUser?.userId) {
    return responseHandler.failure(
      'User not authenticated',
      'Unauthorized',
      401
    );
  }

  const body: UpdateUserDTO = await req.json();
  const { name, phone, avatar } = body;

  const allowedUpdates: UpdateUserDTO = {};
  if (name) allowedUpdates.name = name.trim();
  if (phone !== undefined) allowedUpdates.phone = phone?.trim();
  if (avatar !== undefined) allowedUpdates.avatar = avatar;

  const existingUser = await findById<IUser>('users', currentUser.userId);
  if (!existingUser) {
    return responseHandler.failure(
      'User not found',
      'Not Found',
      404
    );
  }

  const updatedUser = await updateById<IUser>(
    'users',
    currentUser.userId,
    allowedUpdates
  );

  if (!updatedUser) {
    return responseHandler.failure(
      'Failed to update profile',
      'Update Failed',
      500
    );
  }

  return responseHandler.success(
    { user: toSafeUser(updatedUser) },
    'Profile updated successfully'
  );
});

// DELETE /api/private/me
export const DELETE = withErrorHandler(async (req: NextRequest) => {
  const currentUser = await getReqUser(req);

  if (!currentUser?.userId) {
    return responseHandler.failure(
      'User not authenticated',
      'Unauthorized',
      401
    );
  }

  const user = await findById<IUser>('users', currentUser.userId);

  if (!user) {
    return responseHandler.failure(
      'User not found',
      'Not Found',
      404
    );
  }

  const updatedUser = await updateById<IUser>('users', currentUser.userId, {
    status: UserStatus.INACTIVE,
  });

  if (!updatedUser) {
    return responseHandler.failure(
      'Failed to delete account',
      'Delete Failed',
      500
    );
  }

  return responseHandler.success(
    { user: toSafeUser(updatedUser) },
    'Account deactivated successfully'
  );
});