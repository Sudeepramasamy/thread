import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { totalItemCount, openCart } = useCart();
  const { isAuthenticated, adminUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Men', href: '/shop?category=mens-collection' },
    { label: 'Women', href: '/shop?category=womens-collection' },
    { label: 'Outerwear', href: '/shop?category=outerwear' },
    { label: 'Knitwear', href: '/shop?category=knitwear' },
    { label: 'Accessories', href: '/shop?category=accessories' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E8E6E1] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-brand-dark hover:text-black focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="group flex flex-col items-center">
                <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-widest text-[#101012] group-hover:opacity-90 transition-opacity">
                  THREAD & CO.
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-brand-500 font-sans -mt-1">
                  Atelier
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-xs font-medium tracking-widest uppercase text-[#3A3835] hover:text-[#101012] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#101012] hover:after:w-full after:transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Action Icons: Search, Account/Admin, Bag */}
            <div className="flex items-center space-x-5">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#2A2721] hover:text-black transition-colors"
                aria-label="Search items"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* Account / Admin Portal */}
              <Link
                to={isAuthenticated ? '/admin' : '/admin/login'}
                className="p-2 text-[#2A2721] hover:text-black transition-colors relative"
                aria-label="Admin or Account"
                title={isAuthenticated ? `Logged in as ${adminUser?.name}` : 'Admin Portal'}
              >
                <User className="w-5 h-5 stroke-[1.5]" />
                {isAuthenticated && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="p-2 text-[#2A2721] hover:text-black transition-colors relative"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#101012] text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {totalItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#E8E6E1] bg-[#FAF9F5] py-4 px-4 sm:px-8 fade-in">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cashmere coats, silk dresses, Supima mocknecks..."
                className="w-full bg-transparent border-none text-base text-[#101012] focus:outline-none placeholder:text-gray-400 font-sans"
                autoFocus
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-widest font-semibold px-4 py-2 bg-[#101012] text-white hover:bg-black transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8E6E1] bg-[#FAF9F5] px-6 py-8 fade-in">
            <div className="flex flex-col space-y-5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium tracking-wider uppercase text-[#101012] flex items-center justify-between border-b border-[#EAE7E0] pb-3"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Track Order
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Contact Concierge
                </Link>
                <Link
                  to={isAuthenticated ? '/admin' : '/admin/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-brand-dark"
                >
                  {isAuthenticated ? 'Admin Dashboard →' : 'Admin Login →'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
