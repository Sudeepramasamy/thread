import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <div className="w-16 h-16 bg-[#F4F2EC] rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest text-[#8E826C]">
        404 — Page Not Found
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#101012] mt-2 mb-4">
        An Uncharted Pathway
      </h1>
      <p className="text-xs text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
        The archive page or seasonal garment you are attempting to view may have moved or been retired from the collection.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors"
        >
          Return Home
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 py-3.5 border border-[#101012] text-[#101012] text-xs font-semibold uppercase tracking-widest hover:bg-[#F4F2EC] transition-colors"
        >
          Explore Ready-to-Wear
        </Link>
      </div>
    </div>
  );
}
