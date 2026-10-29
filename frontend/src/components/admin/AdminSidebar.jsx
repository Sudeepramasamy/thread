import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  FolderTree,
  ShoppingBag,
  Inbox,
  Users,
  LogOut,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ mobileOpen, onClose }) {
  const { adminUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Shirt },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Customer Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Inquiries & Messages', href: '/admin/messages', icon: Inbox },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#101013] text-[#FAF9F5] border-r border-[#24242A] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo in Admin */}
          <div className="h-20 flex items-center px-6 border-b border-[#24242A]">
            <Link to="/admin" className="flex flex-col" onClick={onClose}>
              <span className="font-serif text-xl font-bold tracking-widest text-white">
                THREAD & CO.
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880]">
                Management Portal
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/admin'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-3 rounded-sm text-xs uppercase tracking-wider font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1C1C22] text-[#C5A880] border-l-2 border-[#C5A880]'
                        : 'text-gray-400 hover:text-white hover:bg-[#18181E]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Storefront Link */}
        <div className="p-4 border-t border-[#24242A] space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-gray-400 hover:text-white p-2 rounded-sm hover:bg-[#18181E] transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Storefront</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          </Link>

          <div className="pt-2 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-xs font-semibold text-white block truncate">
                {adminUser?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-[#C5A880] uppercase tracking-wider block">
                {adminUser?.role || 'Admin'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
