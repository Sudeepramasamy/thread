import React from 'react';
import { Menu, Bell, User, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader({ onOpenMobileMenu }) {
  const { adminUser } = useAuth();

  return (
    <header className="h-20 bg-[#FAF9F5] border-b border-[#E8E6E1] flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-gray-700 hover:text-black"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
            THREAD & CO. Management System
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="text-xs text-[#101012] hover:underline font-semibold flex items-center space-x-1"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="h-4 w-px bg-gray-300" />

        <div className="flex items-center space-x-2 text-xs text-gray-700">
          <div className="w-7 h-7 rounded-full bg-[#101012] text-white flex items-center justify-center font-semibold text-[11px]">
            {adminUser?.name?.charAt(0) || 'A'}
          </div>
          <span className="hidden sm:inline font-medium">{adminUser?.name || 'Administrator'}</span>
        </div>
      </div>
    </header>
  );
}
