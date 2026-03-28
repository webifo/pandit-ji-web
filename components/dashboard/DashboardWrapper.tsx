"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, getMe } from '@/store/slices/authSlice';
import { UserRole } from '@/config/constants';

interface DashboardWrapperProps {
    children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, loading } = useAppSelector((state) => state.auth);
    const [isCheckingAccess, setIsCheckingAccess] = useState(true);

    const checkAccess = async () => {
        await dispatch(getMe());
        setIsCheckingAccess(false);
    }

    useEffect(() => {
        checkAccess();
    }, []);

    useEffect(() => {
        const isAdmin = user?.role?.includes(UserRole.ADMIN);
        if(!isCheckingAccess) {
            if (!user) {
                router.push('/');
            } else if (!isAdmin) {
                dispatch(logout());
                router.push('/login');
            }
        }
    }, [user, loading, isCheckingAccess, router, dispatch]);

    // Show loading while checking auth/role
    if (loading || isCheckingAccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-red-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9933] mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const isAdmin = user!.role.includes(UserRole.ADMIN);
    if (!isAdmin) {
        return null;
    }

    return <>{children}</>;
}