import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Feather, Globe2, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-24 sm:space-y-32 py-12 sm:py-16">
      {/* 1. Atelier Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8E826C]">
            The Atelier & Legacy
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold text-[#101012] leading-tight">
            Crafting the Architecture of Contemporary Wardrobes
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed pt-2">
            Founded with a singular commitment: to strip away superfluous adornment and elevate garment construction through immaculate fabrics and purposeful lines.
          </p>
        </div>

        <div className="mt-14 aspect-[21/9] w-full rounded-sm overflow-hidden bg-zinc-900 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1800&auto=format&fit=crop"
            alt="THREAD & CO. Studio Atmosphere"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* 2. Philosophy & Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-[#FAF9F5] p-8 border border-[#E8E6E1] rounded-sm space-y-3">
            <Feather className="w-6 h-6 text-[#C5A880]" />
            <h3 className="font-serif text-xl font-semibold text-[#101012]">
              Material Purity
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              We exclusively select natural fibers—Grade-A Mongolian cashmere, Californian Supima cotton, and double-faced Virgin Melton wool woven in Biella, Italy.
            </p>
          </div>

          <div className="bg-[#FAF9F5] p-8 border border-[#E8E6E1] rounded-sm space-y-3">
            <Sparkles className="w-6 h-6 text-[#C5A880]" />
            <h3 className="font-serif text-xl font-semibold text-[#101012]">
              Architectural Tailoring
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Every curve, shoulder rope, and pleat is engineered with architectural intentionality. Garments that drape effortlessly while conferring quiet authority.
            </p>
          </div>

          <div className="bg-[#FAF9F5] p-8 border border-[#E8E6E1] rounded-sm space-y-3">
            <Globe2 className="w-6 h-6 text-[#C5A880]" />
            <h3 className="font-serif text-xl font-semibold text-[#101012]">
              Enduring Stewardship
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              We operate on limited-batch seasonal capsules. No excess manufacturing, zero polyester blends, and ethical certified family-owned artisanal partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The Story Section */}
      <section className="bg-[#121215] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A880]">
                Behind the Needle
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white leading-snug">
                Where Traditional Heritage Meets Modern Precision
              </h2>
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                From our design studio in New York to weaving mills in northern Italy, each THREAD & CO. piece passes through over thirty stages of hand-finishing.
              </p>
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                We believe true modern luxury is the luxury of calm clarity. Clothes that fit so intuitively you cease to think about them—yet radiate undeniable poise.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center px-8 py-3.5 bg-white text-[#101012] text-xs font-semibold uppercase tracking-widest hover:bg-[#EAE7E0] transition-colors"
                >
                  <span>Explore The Garments</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            <div className="aspect-[4/3] rounded-sm overflow-hidden bg-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop"
                alt="Tailoring atelier fabric cutting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
