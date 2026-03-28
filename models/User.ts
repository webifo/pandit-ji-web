import { UserRole, UserStatus } from '@/config/constants';
import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole[];
  status: UserStatus;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SafeUser = Omit<IUser, 'password'>;

export type CreateUserDTO = Pick<IUser, 'name' | 'email' | 'password'> & {
  role?: UserRole[];
  phone?: string;
};

export type UpdateUserDTO = Partial<
  Pick<IUser, 'name' | 'phone' | 'avatar' | 'status' | 'role' | 'isEmailVerified' | 'lastLoginAt'>
>;

export const toSafeUser = (user: IUser): SafeUser => {
  const { password, ...safeUser } = user;
  return safeUser;
};