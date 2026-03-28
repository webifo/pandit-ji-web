"use client";

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { UserRole } from '@/config/constants';
import DashboardWrapper from '@/components/dashboard/DashboardWrapper';
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  return (
    <DashboardWrapper>
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
              <span className="text-gray-700">
                Welcome, <span className="font-semibold">{user?.name || user?.email}</span>!
                {user?.role.includes(UserRole.ADMIN) && (
                  <span className="ml-2 px-2 py-1 bg-[#FF9933] text-white text-xs rounded-full">
                    Admin
                  </span>
                )}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#FF9933]">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-[#FF9933]">--</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#FF7722]">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Rituals</h3>
              <p className="text-3xl font-bold text-[#FF7722]">--</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Festivals</h3>
              <p className="text-3xl font-bold text-orange-500">--</p>
            </div>
          </div>

          {/* Admin Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Actions</h2>
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
              
              <Link 
                href="/dashboard/users"
                className="flex items-center gap-4 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition group"
              >
                <div className="text-4xl">👥</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition">
                    User Management
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage users and roles
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}