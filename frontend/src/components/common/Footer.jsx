import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RefreshCw, Mail } from 'lucide-react';
import api from '../../services/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, success: false, message: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus({ loading: true, success: false, message: '' });
    try {
      const res = await api.post('/newsletter/subscribe', { email });
      setStatus({ loading: false, success: true, message: res.data.message || 'Subscribed successfully!' });
      setEmail('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Subscription failed. Please try again.';
      setStatus({ loading: false, success: false, message: msg });
    }
  };

  return (
    <footer className="bg-[#101012] text-[#F3F1EC] pt-16 pb-12 border-t border-[#26262B]">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#2A2A30]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex items-center sm:items-start space-x-4">
            <div className="p-3 bg-[#1A1A1E] rounded-sm text-[#C5A880] flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-1">
                Complimentary Shipping
              </h4>
              <p className="text-xs text-gray-400">
                Delivered worldwide on all orders above $300.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start space-x-4">
            <div className="p-3 bg-[#1A1A1E] rounded-sm text-[#C5A880] flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-1">
                30-Day Effortless Returns
              </h4>
              <p className="text-xs text-gray-400">
                Complimentary exchanges & insured returns.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start space-x-4">
            <div className="p-3 bg-[#1A1A1E] rounded-sm text-[#C5A880] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-1">
                Artisanal Integrity
              </h4>
              <p className="text-xs text-gray-400">
                100% natural, certified traceable fabrics.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:items-start space-x-4">
            <div className="p-3 bg-[#1A1A1E] rounded-sm text-[#C5A880] flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-1">
                Private Concierge
              </h4>
              <p className="text-xs text-gray-400">
                Tailoring guidance & personalized sizing advice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <span className="font-serif text-2xl font-semibold tracking-widest text-white">
                THREAD & CO.
              </span>
              <p className="text-xs text-gray-400 mt-2 max-w-sm leading-relaxed">
                An independent luxury fashion house dedicated to timeless architectural silhouettes, organic fabrics, and modern ready-to-wear essentials.
              </p>
            </div>

            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-widest text-white mb-2">
                Join the Private Gazette
              </h5>
              <p className="text-xs text-gray-400 mb-3">
                Receive private showroom invites, runway previews, and early access to limited capsule releases.
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="bg-[#1C1C22] border border-[#33333C] px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A880] flex-1 rounded-l-sm"
                />
                <button
                  type="submit"
                  disabled={status.loading}
                  className="bg-[#C5A880] text-[#101012] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-[#B3956B] transition-colors rounded-r-sm flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
                >
                  <span>{status.loading ? 'Joining...' : 'Subscribe'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {status.message && (
                <p className={`text-xs mt-2 ${status.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {status.message}
                </p>
              )}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link to="/shop?category=mens-collection" className="hover:text-white transition-colors">
                  Men's Tailoring
                </Link>
              </li>
              <li>
                <Link to="/shop?category=womens-collection" className="hover:text-white transition-colors">
                  Women's Ready-to-Wear
                </Link>
              </li>
              <li>
                <Link to="/shop?category=outerwear" className="hover:text-white transition-colors">
                  Outerwear & Coats
                </Link>
              </li>
              <li>
                <Link to="/shop?category=knitwear" className="hover:text-white transition-colors">
                  Mongolian Cashmere
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="hover:text-white transition-colors">
                  Italian Leather & Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link to="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Atelier & Story
                </Link>
              </li>
              <li>
                <Link to="/policy/shipping" className="hover:text-white transition-colors">
                  Delivery & Global Duties
                </Link>
              </li>
              <li>
                <Link to="/policy/returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link to="/policy/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/policy/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/policy/sustainability" className="hover:text-white transition-colors">
                  Sustainability Report
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-block text-[11px] text-[#C5A880] border border-[#C5A880]/40 px-2.5 py-1 hover:bg-[#C5A880] hover:text-black transition-colors rounded-sm"
                >
                  Admin Management →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#26262B] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div>
          © {new Date().getFullYear()} THREAD & CO. All rights reserved. Crafted for portfolio showcase.
        </div>
        <div className="flex items-center space-x-6 text-gray-400">
          <span>Demo Checkout Enabled</span>
          <span>•</span>
          <span>PostgreSQL + NestJS + React</span>
        </div>
      </div>
    </footer>
  );
}
