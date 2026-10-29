import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, Shield, Compass, HeartHandshake } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        setLoading(true);
        const [featuredRes, arrivalsRes, catsRes] = await Promise.all([
          api.get('/products/featured?limit=4'),
          api.get('/products/new-arrivals?limit=8'),
          api.get('/categories'),
        ]);

        setFeaturedProducts(featuredRes.data || []);
        setNewArrivals(arrivalsRes.data || []);
        setCategories(catsRes.data || []);
      } catch (err) {
        console.error('Error fetching homepage data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  const testimonials = [
    {
      name: 'Victoria Hastings',
      location: 'New York, USA',
      review: 'The Atelier Double-Breasted Wool Overcoat exceeded all expectations. The weight of the Italian wool and the precision of the peak lapels rival bespoke Parisian tailoring.',
      rating: 5,
      item: 'Atelier Double-Breasted Wool Overcoat',
    },
    {
      name: 'Laurent Moreau',
      location: 'Paris, France',
      review: 'Minimalism at its most elevated. The Supima cotton mockneck holds its structure effortlessly after countless washes. Fastidious attention to detail.',
      rating: 5,
      item: 'Supima Cotton Mockneck',
    },
    {
      name: 'Elena Rostova',
      location: 'Milan, Italy',
      review: 'The Mongolian cashmere cardigan is a dream to wear. Lightweight yet remarkably insulating. THREAD & CO. has become my permanent seasonal wardrobe foundation.',
      rating: 5,
      item: 'Sculpted Cashmere Cardigan',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. Large Fashion Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center bg-[#0F0E11] text-white overflow-hidden">
        {/* Background Image with subtle cinematic zoom */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
            alt="Autumn Winter 2026 Fashion Campaign"
            className="w-full h-full object-cover object-center opacity-65 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-black/30 to-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs uppercase tracking-widest text-[#E6E2D8]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Autumn / Winter 2026 Collection</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              Architectural Tailoring. Mindful Luxury.
            </h1>

            <p className="text-base sm:text-lg text-gray-200 font-light leading-relaxed max-w-xl">
              Sculpted silhouettes cut from Virgin Italian Melton wool, Grade-A Mongolian cashmere, and organic long-staple cottons.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#101012] text-xs font-semibold uppercase tracking-widest hover:bg-[#EAE7E0] transition-all duration-300 shadow-lg group"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop?category=outerwear"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/50 bg-black/30 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
              >
                View Outerwear
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Category Collections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-500">
              Curated Wardrobe
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101012] mt-1">
              Explore by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-widest text-[#101012] hover:text-brand-600 inline-flex items-center mt-3 md:mt-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 3).map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative h-96 overflow-hidden rounded-sm bg-[#F0EEE8]"
            >
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'}
                alt={cat.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                  {cat._count?.products || 'Featured'} Pieces
                </span>
                <h3 className="font-serif text-2xl font-semibold mt-1 mb-2 text-white">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-2 mb-3 font-light">
                  {cat.description}
                </p>
                <span className="inline-flex items-center text-xs uppercase tracking-widest font-semibold group-hover:translate-x-1 transition-transform text-[#E6E2D8]">
                  <span>Discover Capsule</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Showcase (Spotlight Items) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-500">
              The Editor's Choice
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101012] mt-1">
              Featured Signatures
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-widest text-[#101012] hover:text-brand-600 inline-flex items-center mt-3 md:mt-0"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-sm mb-3" />
                <div className="h-4 bg-gray-200 w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Seasonal Editorial Lookbook Banner */}
      <section className="bg-[#121215] text-[#FAF9F5] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
                Editorial Perspective
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight text-white">
                Mindful Craftsmanship, Timeless Architecture.
              </h2>
              <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
                At THREAD & CO., we resist the disposable cadence of fast-paced trends. Every garment is an intentional study in drape, seam construction, and natural fiber longevity.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#2B2B32]">
                <div>
                  <h4 className="font-serif text-2xl font-semibold text-white">100%</h4>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                    Traceable Organic Fibers
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-semibold text-white">Biella & Tuscany</h4>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                    Italian Heritage Mills
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-[#C5A880] text-[#101012] text-xs font-semibold uppercase tracking-widest hover:bg-[#B3956B] transition-colors"
                >
                  Read Our Manifesto
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden rounded-sm bg-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop"
                  alt="Men tailored wool overcoat"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden rounded-sm bg-zinc-800 translate-y-6">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
                  alt="Women wide leg silk trouser"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-500">
              Just Arrived in Studio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101012] mt-1">
              New Season Arrivals
            </h2>
          </div>
          <Link
            to="/shop?sortBy=newest"
            className="text-xs font-semibold uppercase tracking-widest text-[#101012] hover:text-brand-600 inline-flex items-center mt-3 md:mt-0"
          >
            <span>View All New Pieces</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-sm mb-3" />
                <div className="h-4 bg-gray-200 w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Customer Testimonials */}
      <section className="bg-[#F4F2EC] py-20 border-y border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">
              Client Perspectives
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101012] mt-1">
              Enduring Reverence
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Sample impressions from verified collectors worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9F5] p-8 rounded-sm border border-[#E5E2DA] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1 text-[#C5A880] mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed italic mb-6">
                    "{t.review}"
                  </p>
                </div>
                <div className="pt-4 border-t border-[#EAE7E0]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#101012]">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-gray-500">{t.location}</p>
                  <span className="text-[10px] text-brand-600 block mt-1 font-medium">
                    Verified Purchase: {t.item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
