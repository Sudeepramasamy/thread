import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';

export default function CheckoutPage() {
  const { cartItems, subtotal, shippingFee, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    shippingCountry: 'United States',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Generate or retrieve idempotency key
  const [idempotencyKey] = useState(() => `tc_checkout_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-4">
          Your Bag is Empty
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3.5 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!formData.customerName.trim()) errs.customerName = 'Full name is required';
    if (!formData.customerEmail.trim()) {
      errs.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      errs.customerEmail = 'Please provide a valid email address';
    }
    if (!formData.customerPhone.trim()) errs.customerPhone = 'Phone number is required';
    if (!formData.shippingAddress.trim()) errs.shippingAddress = 'Street address is required';
    if (!formData.shippingCity.trim()) errs.shippingCity = 'City is required';
    if (!formData.shippingPostalCode.trim()) errs.shippingPostalCode = 'Postal / Zip code is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');

    try {
      // Map items for the NestJS API
      const payload = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        shippingAddress: formData.shippingAddress.trim(),
        shippingCity: formData.shippingCity.trim(),
        shippingPostalCode: formData.shippingPostalCode.trim(),
        shippingCountry: formData.shippingCountry,
        notes: formData.notes.trim() || undefined,
        idempotencyKey,
        items: cartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || undefined,
          quantity: item.quantity,
        })),
      };

      const response = await api.post('/orders', payload);
      const createdOrder = response.data;

      // Clear the local cart
      clearCart();

      // Navigate to order confirmation
      navigate('/order-confirmation', {
        state: { order: createdOrder },
      });
    } catch (err) {
      console.error('Order creation failed', err);
      const errorMsg =
        err.response?.data?.message ||
        'Unable to process order. Some items may have changed stock or prices.';
      setApiError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/cart"
          className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-black inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping Bag</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-500">
              Checkout Step
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101012] mt-1">
              Delivery Details
            </h1>
          </div>

          {/* Demo Notice Banner */}
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-sm text-xs space-y-1">
            <div className="flex items-center space-x-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Demo Portfolio Checkout</span>
            </div>
            <p className="text-amber-800 leading-relaxed pl-6">
              This order will be processed in DEMO mode. Inventory will be updated in the PostgreSQL database, but <strong>no real payment or card details are required</strong>.
            </p>
          </div>

          {apiError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleOrderSubmit} id="checkout-form" className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#101012] border-b border-[#EAE7E0] pb-2">
                1. Contact Information
              </h3>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Victoria Sterling"
                  className={`w-full bg-white border px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black rounded-sm ${
                    errors.customerName ? 'border-red-500' : 'border-[#D5CEC0]'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">
                    Email Address (for order confirmation) *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="victoria@example.com"
                    className={`w-full bg-white border px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black rounded-sm ${
                      errors.customerEmail ? 'border-red-500' : 'border-[#D5CEC0]'
                    }`}
                  />
                  {errors.customerEmail && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.customerEmail}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">
                    Phone Number (for courier dispatch) *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full bg-white border px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black rounded-sm ${
                      errors.customerPhone ? 'border-red-500' : 'border-[#D5CEC0]'
                    }`}
                  />
                  {errors.customerPhone && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.customerPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#101012] border-b border-[#EAE7E0] pb-2">
                2. Shipping Destination
              </h3>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  placeholder="e.g. 740 Park Avenue, Apt 12B"
                  className={`w-full bg-white border px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black rounded-sm ${
                    errors.shippingAddress ? 'border-red-500' : 'border-[#D5CEC0]'
                  }`}
                />
                {errors.shippingAddress && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.shippingAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="text-xs font-medium text-gray-700 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    placeholder="New York"
                    className={`w-full bg-white border px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black rounded-sm ${
                      errors.shippingCity ? 'border-red-500' : 'border-[#D5CEC0]'
                    }`}
                  />
                  {errors.shippingCity && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.shippingCity}</p>
                  )}
                </div>

                <div className="sm:col-span-1">
                  <label className="text-xs font-medium text-gray-700 block mb-1">
                    Postal / Zip Code *
                  </label>
                  <input
                    type="text"
                    name="shippingPostalCode"
                    value={formData.shippingPostalCode}
                    onChange={handleChange}
                    placeholder="10021"
                    className={`w-full bg-white border px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black rounded-sm ${
                      errors.shippingPostalCode ? 'border-red-500' : 'border-[#D5CEC0]'
                    }`}
                  />
                  {errors.shippingPostalCode && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.shippingPostalCode}</p>
                  )}
                </div>

                <div className="sm:col-span-1">
                  <label className="text-xs font-medium text-gray-700 block mb-1">
                    Country
                  </label>
                  <select
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#D5CEC0] px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black rounded-sm"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Italy">Italy</option>
                    <option value="Canada">Canada</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Courier Delivery Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special instructions for doorman or gate code..."
                  className="w-full bg-white border border-[#D5CEC0] px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-black rounded-sm"
                />
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#101012] border-b border-[#EAE7E0] pb-2">
                3. Payment Method
              </h3>
              <div className="p-4 bg-[#F4F2EC] border border-[#E5E1D8] rounded-sm flex items-start space-x-3">
                <Lock className="w-4 h-4 text-gray-700 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-gray-900 block">
                    Portfolio Demo Checkout (No Charge)
                  </span>
                  <p className="text-gray-500 mt-0.5">
                    No card or payment credentials required. Your order will be confirmed and inventory safely reserved in the NestJS database.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 shadow-md flex items-center justify-center space-x-2"
              >
                <span>{submitting ? 'Creating Order in Database...' : `Place Demo Order ($${total.toFixed(2)})`}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-5">
          <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-sm border border-[#E8E6E1] space-y-6 sticky top-28 shadow-sm">
            <h3 className="font-serif text-xl font-semibold text-[#101012] border-b border-[#EAE7E0] pb-4">
              Bag Summary ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>

            {/* Items Mini List */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1 divide-y divide-[#EAE7E0]">
              {cartItems.map((item) => (
                <div key={item.itemId} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-14 h-16 object-cover bg-gray-100 rounded-sm flex-shrink-0"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-gray-900 truncate">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• ${item.color}`}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-900">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-gray-600 pt-4 border-t border-[#EAE7E0]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700">Complimentary</strong>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-900 pt-3 border-t border-[#EAE7E0]">
                <span>Order Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-gray-400 space-y-2 border-t border-[#EAE7E0]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Immediate Order Reference Number</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Atomic stock deduction in PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
