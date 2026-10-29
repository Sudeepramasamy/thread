import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Shirt,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Inbox,
  ShieldCheck,
  Package,
} from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await api.get('/dashboard');
        setMetrics(res.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
        setError('Failed to fetch store metrics. Please verify backend connection.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 w-1/4 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-800 rounded-sm text-xs">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E0DCD3] gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E826C] font-semibold">
            Store Performance
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#101012] mt-0.5">
            Dashboard Overview
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-[#101012] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black rounded-sm transition-colors"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 border border-[#101012] text-[#101012] text-xs font-semibold uppercase tracking-wider hover:bg-white rounded-sm transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-[#FAF9F5] p-6 rounded-sm border border-[#E8E6E1] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs uppercase font-semibold tracking-wider text-gray-600">
              Total Revenue
            </span>
            <div className="p-2 bg-emerald-50 rounded-sm text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#101012]">
              ${metrics?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-emerald-700 block mt-1 font-medium">
              Avg Order: ${metrics?.averageOrderValue?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#FAF9F5] p-6 rounded-sm border border-[#E8E6E1] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs uppercase font-semibold tracking-wider text-gray-600">
              Total Orders
            </span>
            <div className="p-2 bg-blue-50 rounded-sm text-blue-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#101012]">
              {metrics?.totalOrders}
            </span>
            <span className="text-[11px] text-gray-500 block mt-1">
              Recorded in database
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-[#FAF9F5] p-6 rounded-sm border border-[#E8E6E1] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs uppercase font-semibold tracking-wider text-gray-600">
              Active Catalog
            </span>
            <div className="p-2 bg-purple-50 rounded-sm text-purple-700">
              <Shirt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#101012]">
              {metrics?.totalProducts}
            </span>
            <span className="text-[11px] text-gray-500 block mt-1">
              Across {metrics?.categoriesCount} categories
            </span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-[#FAF9F5] p-6 rounded-sm border border-[#E8E6E1] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs uppercase font-semibold tracking-wider text-gray-600">
              Low Stock Alerts
            </span>
            <div className="p-2 bg-amber-50 rounded-sm text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#101012]">
              {metrics?.lowStockCount}
            </span>
            <span className="text-[11px] text-amber-800 block mt-1 font-medium">
              ≤ 10 items in inventory
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Calculation Rules Note */}
      <div className="p-4 bg-[#F0EEE8] border border-[#DDD9CF] rounded-sm text-xs text-gray-700 flex items-start space-x-3">
        <ShieldCheck className="w-4 h-4 text-gray-800 mt-0.5 flex-shrink-0" />
        <div>
          <strong className="text-gray-900 block font-semibold">
            Financial Calculation Rules
          </strong>
          <p className="text-[11px] text-gray-600 mt-0.5">
            Total Revenue calculates the sum of order totals strictly for confirmed orders (statuses: <em>CONFIRMED</em>, <em>PROCESSING</em>, <em>SHIPPED</em>, <em>DELIVERED</em>). Orders with status <em>PENDING</em> or <em>CANCELLED</em> are explicitly excluded from revenue calculations.
          </p>
        </div>
      </div>

      {/* Middle Row: Recent 7-Day Trend & Low Stock Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Trend Bar Breakdown */}
        <div className="lg:col-span-7 bg-[#FAF9F5] p-6 sm:p-8 rounded-sm border border-[#E8E6E1] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE7E0] pb-3">
            <h3 className="font-serif text-lg font-semibold text-[#101012]">
              Recent Sales Activity
            </h3>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
              7-Day Cadence
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {metrics?.salesChart?.map((day) => {
              const maxVal = Math.max(...(metrics?.salesChart?.map((d) => d.sales) || [1]), 100);
              const barWidth = Math.max(5, Math.round((day.sales / maxVal) * 100));

              return (
                <div key={day.date} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-gray-700">{day.date}</span>
                    <span className="font-semibold text-gray-900">
                      ${day.sales.toFixed(2)} ({day.count} {day.count === 1 ? 'order' : 'orders'})
                    </span>
                  </div>
                  <div className="w-full bg-[#EAE7E0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#101012] h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts Table */}
        <div className="lg:col-span-5 bg-[#FAF9F5] p-6 sm:p-8 rounded-sm border border-[#E8E6E1] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE7E0] pb-3">
            <h3 className="font-serif text-lg font-semibold text-[#101012]">
              Inventory Restock Warnings
            </h3>
            <span className="text-[11px] text-amber-800 font-semibold uppercase">
              ≤ 10 Units
            </span>
          </div>

          <div className="divide-y divide-[#EAE7E0] max-h-80 overflow-y-auto">
            {metrics?.lowStockProducts?.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">
                All garments have sufficient inventory counts.
              </p>
            ) : (
              metrics?.lowStockProducts?.map((p) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <span className="font-medium text-gray-900 block truncate">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {p.category?.name} • ${Number(p.price).toFixed(2)}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-sm font-semibold text-[10px] uppercase flex-shrink-0 ${
                      p.stock === 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders Table */}
      <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-sm border border-[#E8E6E1] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE7E0] pb-4">
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#101012]">
              Recent Orders
            </h3>
            <span className="text-xs text-gray-500">
              Latest client purchases logged in PostgreSQL
            </span>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-[#101012] hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0EEE8] text-gray-700 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE7E0]">
              {metrics?.recentOrders?.map((ord) => (
                <tr key={ord.id} className="hover:bg-white transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-gray-900">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900 block">{ord.customerName}</span>
                    <span className="text-[10px] text-gray-500">{ord.customerEmail}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {ord.items?.length || 0} pieces
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    ${Number(ord.total).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-sm font-semibold uppercase text-[10px] bg-emerald-100 text-emerald-800">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
