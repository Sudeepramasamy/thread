import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    tax,
    total,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 300;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = (freeShippingThreshold - subtotal).toFixed(2);

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] shadow-2xl flex flex-col slide-in-right">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E6E1]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#101012]" />
              <h2 className="text-sm font-semibold tracking-widest uppercase text-[#101012]">
                Your Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 text-gray-500 hover:text-black transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tracker */}
          <div className="bg-[#F3F1EC] px-6 py-3 border-b border-[#E8E6E1]">
            <div className="text-xs text-[#2A2721] flex justify-between font-medium mb-1.5">
              {subtotal >= freeShippingThreshold ? (
                <span className="text-emerald-800 font-semibold">✨ You have unlocked complimentary express shipping!</span>
              ) : (
                <span>
                  Add <strong className="text-black">${amountNeededForFreeShipping}</strong> more for complimentary shipping
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

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#EAE7E0]">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#F3F1EC] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-7 h-7 text-gray-400" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">
                  Your bag is empty
                </h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Explore our curated seasonal tailoring, Italian wool knitwear, and modern essentials.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="px-6 py-3 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.itemId} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.productSlug}`}
                    onClick={closeCart}
                    className="w-20 h-24 bg-[#F0EFEA] rounded-sm overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop';
                      }}
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/product/${item.productSlug}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-[#101012] hover:underline line-clamp-1"
                        >
                          {item.productName}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.itemId)}
                          className="text-gray-400 hover:text-red-600 transition-colors ml-2 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-1 text-xs text-gray-500 space-x-2">
                        {item.size && <span>Size: <strong>{item.size}</strong></span>}
                        {item.color && <span>• Color: <strong>{item.color}</strong></span>}
                      </div>

                      <div className="mt-1 text-sm font-semibold text-[#101012]">
                        ${item.unitPrice.toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#D5CEC0] bg-white rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                          className="p-1 px-2 text-gray-600 hover:text-black"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-gray-900 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                          disabled={item.quantity >= item.availableStock}
                          className="p-1 px-2 text-gray-600 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-medium text-gray-600">
                        Subtotal: ${(item.unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Actions */}
          {cartItems.length > 0 && (
            <div className="border-t border-[#E8E6E1] bg-[#FAF9F5] px-6 py-5 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">Complimentary</strong> : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-[#EAE7E0]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    closeCart();
                    navigate('/cart');
                  }}
                  className="w-full py-2.5 border border-[#101012] text-[#101012] text-xs font-semibold uppercase tracking-widest hover:bg-[#F3F1EC] transition-colors"
                >
                  View Full Bag
                </button>
              </div>

              <p className="text-[10px] text-center text-gray-400">
                Taxes calculated at checkout. Free 30-day global returns on unworn items.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
