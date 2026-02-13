// app/dashboard/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9933]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-linear-to-r from-[#FF9933] to-[#FF7722] bg-clip-text text-transparent">
              PanditJi
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/calendar"
              className="text-gray-700 hover:text-[#FF9933] font-semibold transition"
            >
              📅 Calendar
            </Link>
            <span className="text-gray-700">
              Welcome, <span className="font-semibold">{user.firstName || user.email}</span>!
            </span>
            <button
              onClick={handleLogout}
              className="bg-linear-to-r from-[#FF9933] to-[#FF7722] text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#FF9933]">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Rituals</h3>
            <p className="text-3xl font-bold text-[#FF9933]">50+</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#FF7722]">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed Pujas</h3>
            <p className="text-3xl font-bold text-[#FF7722]">12</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Festivals</h3>
            <p className="text-3xl font-bold text-orange-500">3</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link 
              href="/dashboard/calendar"
              className="flex items-center gap-4 p-4 bg-linear-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition group"
            >
              <div className="text-4xl">📅</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#FF9933] transition">
                  Calendar Management
                </h3>
                <p className="text-sm text-gray-600">
                  View and manage Nepali Panchang calendar
                </p>
              </div>
            </Link>
            
            <div className="flex items-center gap-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg opacity-50 cursor-not-allowed">
              <div className="text-4xl">🪔</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Rituals Library
                </h3>
                <p className="text-sm text-gray-600">
                  Coming soon...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
