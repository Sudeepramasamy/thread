import React, { useState } from 'react';
import { Search, Package, MapPin, CheckCircle, Clock, Truck, ShieldAlert, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function TrackOrderPage() {
  const [formData, setFormData] = useState({ orderNumber: '', email: '' });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.orderNumber || !formData.email) {
      setError('Please provide both the order reference number and customer email.');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await api.post('/orders/track', {
        orderNumber: formData.orderNumber.trim(),
        email: formData.email.trim(),
      });
      setOrder(res.data);
    } catch (err) {
      console.error('Order tracking failed', err);
      const msg = err.response?.data?.message || 'No matching order found. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Payment & Stock Reserved', icon: CheckCircle },
    { key: 'PROCESSING', label: 'Atelier Tailoring & Packing', icon: Package },
    { key: 'SHIPPED', label: 'Handed to Courier', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered to Recipient', icon: MapPin },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'CONFIRMED': return 1;
      case 'PROCESSING': return 2;
      case 'SHIPPED': return 3;
      case 'DELIVERED': return 4;
      default: return 1;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs font-semibold tracking-widest uppercase text-brand-500">
          Client Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101012] mt-1">
          Track Your Delivery
        </h1>
        <p className="text-xs text-gray-500 mt-2">
          Verify real-time dispatch progress. Requires your reference number and purchase email.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-sm border border-[#E8E6E1] shadow-sm mb-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-gray-700 block mb-1">
              Order Reference Number *
            </label>
            <input
              type="text"
              placeholder="e.g. TC-2026-8812"
              value={formData.orderNumber}
              onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
              className="w-full bg-white border border-[#D5CEC0] px-3.5 py-2.5 text-xs text-gray-900 rounded-sm focus:outline-none focus:border-black uppercase"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-gray-700 block mb-1">
              Billing / Customer Email *
            </label>
            <input
              type="email"
              placeholder="e.g. eleanor.vance@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white border border-[#D5CEC0] px-3.5 py-2.5 text-xs text-gray-900 rounded-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="sm:col-span-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors rounded-sm disabled:opacity-50 flex items-center justify-center space-x-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'Searching...' : 'Locate'}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-sm flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Results Display */}
      {order && (
        <div className="bg-[#FAF9F5] p-6 sm:p-10 rounded-sm border border-[#E8E6E1] space-y-10 fade-in shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#EAE7E0] gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-500">Order Reference</span>
              <h2 className="font-serif text-2xl font-semibold text-[#101012]">
                {order.orderNumber}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-gray-500 block">Current Status</span>
              <span className="inline-block mt-1 px-3 py-1 bg-[#101012] text-white text-xs uppercase tracking-wider font-semibold rounded-sm">
                {order.status}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          {order.status === 'CANCELLED' ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm">
              This order has been cancelled and inventory has been returned to the studio.
            </div>
          ) : (
            <div className="py-4">
              <div className="relative">
                {/* Connecting bar */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#E0DCD3] -translate-y-1/2 z-0" />
                <div
                  className="hidden md:block absolute top-1/2 left-0 h-0.5 bg-[#101012] -translate-y-1/2 z-0 transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                  {steps.map((st, idx) => {
                    const isPassed = idx <= currentStepIndex;
                    const Icon = st.icon;
                    return (
                      <div key={st.key} className="flex md:flex-col items-center gap-3 md:text-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-colors flex-shrink-0 ${
                            isPassed
                              ? 'bg-[#101012] text-white'
                              : 'bg-white border-2 border-[#D5CEC0] text-gray-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span
                            className={`text-xs uppercase tracking-wider font-semibold block ${
                              isPassed ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Order Details & Line items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#EAE7E0]">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#101012] mb-3">
                Shipping Destination
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {order.customerName}<br />
                {order.shippingAddress}<br />
                {order.shippingCity}, {order.shippingPostalCode}<br />
                {order.shippingCountry}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#101012] mb-3">
                Financial Summary
              </h4>
              <div className="text-xs text-gray-600 space-y-1.5">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{Number(order.shippingFee) === 0 ? 'Complimentary' : `$${Number(order.shippingFee).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${Number(order.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-900 pt-2 border-t border-[#EAE7E0]">
                  <span>Total:</span>
                  <span>${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="pt-4 border-t border-[#EAE7E0] space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#101012]">
              Order Items
            </h4>
            <div className="divide-y divide-[#EAE7E0] bg-white border border-[#E8E6E1] rounded-sm">
              {order.items?.map((it) => (
                <div key={it.id} className="p-3.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-gray-900 block">{it.productName}</span>
                    <span className="text-gray-500 text-[11px]">{it.variantDetails}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 mr-3">Qty: {it.quantity}</span>
                    <span className="font-semibold text-gray-900">${Number(it.subtotal).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
