import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  if (!product) return null;

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images.find((img) => img.isPrimary)?.url || product.images[0].url
      : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';

  const secondaryImage =
    product.images && product.images.length > 1
      ? product.images[1].url
      : null;

  const price = Number(product.price);
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercentage = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  // Unique colors from variants
  const colors = product.variants
    ? Array.from(new Set(product.variants.map((v) => v.colorCode).filter(Boolean)))
    : [];

  return (
    <div className="group relative flex flex-col fade-in">
      {/* Product Image Container */}
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F2EC] rounded-sm block"
      >
        <img
          src={primaryImage}
          alt={product.name}
          className={`h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
            secondaryImage ? 'group-hover:opacity-0' : ''
          }`}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';
          }}
        />

        {/* Secondary Hover Image if available */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="bg-[#101012] text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5">
              -{discountPercentage}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-white/90 backdrop-blur-sm text-[#101012] text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 border border-[#E5E1D8]">
              Featured
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-amber-900/90 text-amber-100 text-[10px] font-medium tracking-wider uppercase px-2 py-0.5">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-red-900 text-white text-[10px] font-medium tracking-wider uppercase px-2 py-0.5">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="w-full block py-2.5 bg-white/95 backdrop-blur-sm text-center text-xs font-semibold tracking-widest uppercase text-[#101012] shadow-sm hover:bg-[#101012] hover:text-white transition-colors">
            View Details
          </span>
        </div>
      </Link>

      {/* Meta Information */}
      <div className="mt-3 flex flex-col flex-1">
        {/* Category & Color Swatches */}
        <div className="flex items-center justify-between text-[11px] text-[#7A756D] uppercase tracking-wider mb-1">
          <span>{product.category?.name || 'Collection'}</span>
          {colors.length > 0 && (
            <div className="flex items-center space-x-1">
              {colors.slice(0, 4).map((code, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block"
                  style={{ backgroundColor: code }}
                  title="Available color"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${product.slug}`}
          className="text-sm font-medium text-[#101012] hover:text-brand-700 transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Price Row */}
        <div className="mt-1.5 flex items-baseline space-x-2">
          {hasDiscount ? (
            <>
              <span className="text-sm font-semibold text-[#101012]">
                ${discountPrice.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-[#101012]">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
