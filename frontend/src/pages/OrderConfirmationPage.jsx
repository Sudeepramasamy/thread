import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShieldCheck, Mail, MapPin } from 'lucide-react';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-3">
          Order Lookup
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          Looking for an existing order? You can track its live status with your reference number.
        </p>
        <Link
          to="/track-order"
          className="inline-block px-8 py-3.5 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest"
        >
          Go to Order Tracking
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Confirmation Hero */}
      <div className="text-center space-y-4 pb-12 border-b border-[#E8E6E1]">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800">
          <CheckCircle className="w-8 h-8" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#8E826C]">
          Order Confirmed & Logged
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#101012]">
          Thank You, {order.customerName.split(' ')[0]}
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Your order has been recorded in the database. A confirmation summary has been logged for reference number:
        </p>
        <div className="inline-block bg-[#F4F2EC] px-4 py-2 border border-[#D5CEC0] rounded-sm text-sm font-semibold tracking-wider text-[#101012]">
          {order.orderNumber}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="my-8 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-sm text-xs">
        <strong>Demo Checkout Notice:</strong> This was a portfolio demonstration transaction. Real inventory counts were deducted in the PostgreSQL database, but no financial card charges occurred.
      </div>

      {/* Order Details & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
        {/* Shipping Address */}
        <div className="bg-[#FAF9F5] p-6 rounded-sm border border-[#E8E6E1] space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#101012]">
            <MapPin className="w-4 h-4 text-gray-700" />
            <span>Shipping Destination</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-medium text-gray-900">{order.customerName}</p>
            <p>{order.shippingAddress}</p>
            <p>{order.shippingCity}, {order.shippingPostalCode}</p>
            <p>{order.shippingCountry}</p>
            <p className="pt-2 text-gray-500">Contact: {order.customerPhone}</p>
          </div>
        </div>

        {/* Order Status & Financial Snapshot */}
        <div className="bg-[#FAF9F5] p-6 rounded-sm border border-[#E8E6E1] space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#101012]">
            <Package className="w-4 h-4 text-gray-700" />
            <span>Status & Totals</span>
          </div>
          <div className="text-xs text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-sm uppercase text-[10px]">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{Number(order.shippingFee) === 0 ? 'Complimentary' : `$${Number(order.shippingFee).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span>${Number(order.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-900 pt-2 border-t border-[#EAE7E0]">
              <span>Total:</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Order Items Table */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#101012]">
          Purchased Garments ({order.items?.length || 0})
        </h3>
        <div className="border border-[#E8E6E1] rounded-sm divide-y divide-[#EAE7E0] bg-white">
          {order.items?.map((item) => (
            <div key={item.id} className="p-4 flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-gray-900 block">{item.productName}</span>
                <span className="text-gray-500 text-[11px]">{item.variantDetails}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 mr-4">Qty: {item.quantity}</span>
                <span className="font-semibold text-gray-900">${Number(item.subtotal).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors text-center"
        >
          Continue Shopping
        </Link>
        <Link
          to="/track-order"
          className="w-full sm:w-auto px-8 py-3.5 border border-[#101012] text-[#101012] text-xs font-semibold uppercase tracking-widest hover:bg-[#F3F1EC] transition-colors text-center"
        >
          Track Order Live
        </Link>
      </div>
    </div>
  );
}
