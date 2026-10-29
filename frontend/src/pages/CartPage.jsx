import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    tax,
    total,
  } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  const freeShippingThreshold = 300;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ATELIER10') {
      const discount = subtotal * 0.1;
      setPromoDiscount(discount);
      setPromoMessage('10% VIP Atelier discount applied!');
    } else {
      setPromoMessage('Invalid voucher code. Try ATELIER10.');
    }
  };

  const finalTotal = Math.max(0, total - promoDiscount);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-20 h-20 bg-[#F4F2EC] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-[#101012] mb-3">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
          Explore our seasonal curation of tailored wool overcoats, fluid silks, and organic essentials.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center px-8 py-4 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors"
        >
          <span>Explore The Collection</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-6 mb-10">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-500">
            Review Selection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101012] mt-1">
            Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-red-700 transition-colors uppercase tracking-wider font-semibold"
        >
          Empty Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Items Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Alert Bar */}
          <div className="bg-[#F3F1EC] p-4 rounded-sm border border-[#E5E1D8]">
            <div className="text-xs text-[#2A2721] flex justify-between font-medium mb-1.5">
              {subtotal >= freeShippingThreshold ? (
                <span className="text-emerald-800 font-semibold">
                  ✨ Congratulations! Complimentary worldwide express delivery unlocked.
                </span>
              ) : (
                <span>
                  Add <strong className="text-black">${(freeShippingThreshold - subtotal).toFixed(2)}</strong> more for complimentary shipping
                </span>
              )}
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#101012] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="divide-y divide-[#EAE7E0] border-t border-b border-[#EAE7E0]">
            {cartItems.map((item) => (
              <div key={item.itemId} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Thumbnail */}
                <Link
                  to={`/product/${item.productSlug}`}
                  className="w-24 h-32 bg-[#F4F2EC] rounded-sm overflow-hidden flex-shrink-0"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop';
                    }}
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 space-y-1">
                  <Link
                    to={`/product/${item.productSlug}`}
                    className="font-serif text-lg font-semibold text-[#101012] hover:text-brand-600 transition-colors"
                  >
                    {item.productName}
                  </Link>
                  <div className="text-xs text-gray-500 space-x-3">
                    {item.size && <span>Size: <strong>{item.size}</strong></span>}
                    {item.color && <span>Color: <strong>{item.color}</strong></span>}
                  </div>
                  <div className="text-xs text-gray-400">
                    Unit Price: ${item.unitPrice.toFixed(2)}
                  </div>
                </div>

                {/* Stepper & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-[#D5CEC0] bg-white rounded-sm">
                    <button
                      onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                      className="p-2 text-gray-600 hover:text-black"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-gray-900 min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                      disabled={item.quantity >= item.availableStock}
                      className="p-2 text-gray-600 hover:text-black disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="font-semibold text-base text-[#101012]">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.itemId)}
                    className="text-gray-400 hover:text-red-700 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs uppercase font-semibold tracking-widest text-[#101012] hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-sm border border-[#E8E6E1] space-y-6 sticky top-28 shadow-sm">
            <h3 className="font-serif text-xl font-semibold text-[#101012] border-b border-[#EAE7E0] pb-4">
              Order Summary
            </h3>

            {/* Price lines */}
            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
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

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Voucher Discount</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-semibold text-gray-900 pt-3 border-t border-[#EAE7E0]">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={applyPromo} className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 block">
                Privilege Code / Voucher
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. ATELIER10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-white border border-[#D5CEC0] px-3 py-2 text-xs uppercase flex-1 rounded-sm focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F3F1EC] border border-[#D5CEC0] text-xs font-semibold uppercase hover:bg-[#EAE7E0] transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className="text-[11px] text-brand-600 font-medium">{promoMessage}</p>
              )}
            </form>

            {/* Checkout Action */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center space-x-2 shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-gray-400 space-y-2 border-t border-[#EAE7E0]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Protected Demo Transaction • No Real Payment Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
