import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { loginAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@threadandco.com');
  const [password, setPassword] = useState('AdminPassword123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginAdmin(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Invalid administrator credentials.');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@threadandco.com');
    setPassword('AdminPassword123!');
  };

  return (
    <div className="min-h-screen bg-[#101013] text-[#FAF9F5] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl font-semibold tracking-widest text-white">
              THREAD & CO.
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] block mt-1">
              Atelier Administrative Portal
            </span>
          </Link>
          <p className="text-xs text-gray-400 pt-2">
            Restricted access for store managers and inventory curators.
          </p>
        </div>

        {/* Demo Quick-Fill Pill */}
        <div className="bg-[#1C1C22] p-4 border border-[#2B2B36] rounded-sm text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#C5A880] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Demo Credentials Available
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] underline text-gray-300 hover:text-white font-medium"
            >
              Fill Credentials
            </button>
          </div>
          <div className="text-gray-400 text-[11px] font-mono">
            Email: admin@threadandco.com<br />
            Pass: AdminPassword123!
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-[#18181E] p-8 border border-[#282832] rounded-sm shadow-xl">
          {error && (
            <div className="p-3 mb-6 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs uppercase font-medium tracking-wider text-gray-400 block mb-1">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@threadandco.com"
                  className="w-full bg-[#121216] border border-[#33333F] px-3.5 py-2.5 pl-10 text-xs text-white rounded-sm focus:outline-none focus:border-[#C5A880]"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase font-medium tracking-wider text-gray-400 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#121216] border border-[#33333F] px-3.5 py-2.5 pl-10 text-xs text-white rounded-sm focus:outline-none focus:border-[#C5A880]"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#C5A880] text-[#101012] text-xs font-semibold uppercase tracking-widest hover:bg-[#B3956B] transition-colors rounded-sm flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#2B2B36] text-center">
            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
