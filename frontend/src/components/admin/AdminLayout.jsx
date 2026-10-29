import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { isAuthenticated, adminUser } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F4F3F0] flex">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <AdminHeader onOpenMobileMenu={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
