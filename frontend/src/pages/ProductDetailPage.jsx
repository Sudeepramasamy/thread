import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);

  // Accordion open states
  const [openAccordion, setOpenAccordion] = useState('fabric');

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/products/${slug}`);
        const p = res.data;
        setProduct(p);

        // Default to first image
        if (p.images && p.images.length > 0) {
          const primary = p.images.find((img) => img.isPrimary) || p.images[0];
          setSelectedImage(primary.url);
        }

        // Default to first variant if exists
        if (p.variants && p.variants.length > 0) {
          setSelectedVariant(p.variants[0]);
        }

        setQuantity(1);
      } catch (err) {
        console.error('Failed to load product', err);
        setError('Garment not found or temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[3/4] bg-gray-200 rounded-sm" />
          <div className="space-y-6">
            <div className="h-4 bg-gray-200 w-1/4" />
            <div className="h-8 bg-gray-200 w-3/4" />
            <div className="h-6 bg-gray-200 w-1/3" />
            <div className="h-24 bg-gray-200 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-4">
          Piece Not Found
        </h2>
        <p className="text-sm text-gray-600 mb-8">{error}</p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3.5 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  const price = Number(product.price);
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
  const effectivePrice = selectedVariant
    ? (discountPrice ?? price) + Number(selectedVariant.additionalPrice || 0)
    : discountPrice ?? price;

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  // Unique sizes & colors
  const availableVariants = product.variants || [];
  const uniqueSizes = Array.from(new Set(availableVariants.map((v) => v.size)));
  const uniqueColors = Array.from(
    new Set(availableVariants.map((v) => JSON.stringify({ name: v.color, code: v.colorCode }))),
  ).map((s) => JSON.parse(s));

  const handleSelectSize = (size) => {
    // Pick variant with this size and current color if possible
    const match =
      availableVariants.find(
        (v) => v.size === size && (!selectedVariant || v.color === selectedVariant.color),
      ) || availableVariants.find((v) => v.size === size);

    if (match) {
      setSelectedVariant(match);
      setQuantity(1);
    }
  };

  const handleSelectColor = (colorName) => {
    const match =
      availableVariants.find(
        (v) => v.color === colorName && (!selectedVariant || v.size === selectedVariant.size),
      ) || availableVariants.find((v) => v.color === colorName);

    if (match) {
      setSelectedVariant(match);
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-gray-400 mb-8 flex items-center space-x-2">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-black transition-colors">
          Shop
        </Link>
        <span>/</span>
        <Link
          to={`/shop?category=${product.category?.slug}`}
          className="hover:text-black transition-colors"
        >
          {product.category?.name || 'Collection'}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Main Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Images Gallery: Thumbnails + Main View */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-24 flex-shrink-0">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-24 rounded-sm overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img.url
                      ? 'border-[#101012] opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Hero Photo */}
          <div className="flex-1 aspect-[3/4] bg-[#F4F2EC] rounded-sm overflow-hidden relative shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop';
              }}
            />
            {discountPrice && (
              <span className="absolute top-4 left-4 bg-[#101012] text-white text-xs font-semibold px-2.5 py-1 tracking-wider uppercase">
                Sale Exclusive
              </span>
            )}
          </div>
        </div>

        {/* Product Details & Purchase Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#8E826C] font-semibold mb-1">
              {product.category?.name}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101012] leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-3 flex items-baseline space-x-3">
              <span className="text-2xl font-semibold text-[#101012]">
                ${effectivePrice.toFixed(2)}
              </span>
              {discountPrice && (
                <span className="text-base text-gray-400 line-through">
                  ${price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Color Selection */}
          {uniqueColors.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#EAE7E0]">
              <div className="flex justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#101012]">
                  Color
                </span>
                <span className="text-gray-500 font-medium">
                  {selectedVariant?.color || uniqueColors[0]?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {uniqueColors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectColor(c.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedVariant?.color === c.name
                        ? 'border-[#101012] ring-2 ring-black/10 scale-105'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.code || '#101012' }}
                    title={c.name}
                  >
                    {selectedVariant?.color === c.name && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          c.code === '#F4F2EC' || c.code === '#FFFFFF' ? 'text-black' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {uniqueSizes.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#101012]">
                  Size
                </span>
                <span className="text-gray-500 text-[11px] underline cursor-pointer">
                  Tailoring & Fit Guide
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {uniqueSizes.map((s) => {
                  const variantForSize = availableVariants.find(
                    (v) => v.size === s && (!selectedVariant || v.color === selectedVariant.color),
                  );
                  const isSizeOutOfStock = !variantForSize || variantForSize.stock <= 0;
                  const isSelected = selectedVariant?.size === s;

                  return (
                    <button
                      key={s}
                      onClick={() => handleSelectSize(s)}
                      disabled={isSizeOutOfStock}
                      className={`py-3 text-xs font-semibold rounded-sm border transition-all ${
                        isSelected
                          ? 'bg-[#101012] text-white border-[#101012]'
                          : isSizeOutOfStock
                          ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through'
                          : 'bg-white text-gray-800 border-[#D5CEC0] hover:border-black'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Availability */}
          <div className="text-xs flex items-center gap-1.5 font-medium">
            {isOutOfStock ? (
              <span className="text-red-700 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Currently Out of Stock
              </span>
            ) : currentStock <= 5 ? (
              <span className="text-amber-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Low Stock: Only {currentStock} pieces remaining in studio
              </span>
            ) : (
              <span className="text-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                In Stock & Ready for Dispatch
              </span>
            )}
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="pt-2 flex gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-[#D5CEC0] bg-white rounded-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="p-3 text-gray-600 hover:text-black disabled:opacity-30"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-xs font-semibold text-gray-900 min-w-[28px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                disabled={quantity >= currentStock || isOutOfStock}
                className="p-3 text-gray-600 hover:text-black disabled:opacity-30"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Bag Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 py-4 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center space-x-2"
            >
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Bag'}</span>
            </button>
          </div>

          {/* Added to Bag Feedback Alert */}
          {addedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between rounded-sm fade-in">
              <span>Added to your bag successfully.</span>
              <Link to="/cart" className="font-semibold underline">
                View Bag →
              </Link>
            </div>
          )}

          {/* Value Assurance Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#EAE7E0] text-[11px] text-gray-500 text-center">
            <div className="p-2">
              <Truck className="w-4 h-4 mx-auto mb-1 text-gray-700" />
              <span>Complimentary Shipping Over $300</span>
            </div>
            <div className="p-2">
              <RotateCcw className="w-4 h-4 mx-auto mb-1 text-gray-700" />
              <span>30-Day Effortless Returns</span>
            </div>
            <div className="p-2">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-gray-700" />
              <span>Artisanal Quality Guarantee</span>
            </div>
          </div>

          {/* Accordion Sections: Fabric, Fit, Shipping */}
          <div className="border-t border-[#EAE7E0] divide-y divide-[#EAE7E0] pt-2">
            {/* Fabric Details */}
            <div>
              <button
                onClick={() => setOpenAccordion(openAccordion === 'fabric' ? '' : 'fabric')}
                className="w-full py-4 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#101012]"
              >
                <span>Fabric & Sustainability</span>
                {openAccordion === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'fabric' && (
                <div className="pb-4 text-xs text-gray-600 leading-relaxed space-y-2 fade-in">
                  <p>
                    Composed of 100% certified natural fibers sourced responsibly from historical Italian and Peruvian mills.
                  </p>
                  <p>
                    Dry clean only. Store on shaped wooden hangers with cedar moth repellents to preserve fiber elasticity and natural drape.
                  </p>
                </div>
              )}
            </div>

            {/* Fit & Sizing */}
            <div>
              <button
                onClick={() => setOpenAccordion(openAccordion === 'fit' ? '' : 'fit')}
                className="w-full py-4 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#101012]"
              >
                <span>Tailoring & Fit Guide</span>
                {openAccordion === 'fit' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'fit' && (
                <div className="pb-4 text-xs text-gray-600 leading-relaxed space-y-2 fade-in">
                  <p>
                    Tailored with a modern structured profile. We recommend selecting your standard size for the intended drape shown in the campaign lookbook.
                  </p>
                  <p>
                    Model is 6'1" (185 cm) wearing size M in Men's / 5'10" (178 cm) wearing size S in Women's.
                  </p>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div>
              <button
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
                className="w-full py-4 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#101012]"
              >
                <span>Delivery & Return Policy</span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="pb-4 text-xs text-gray-600 leading-relaxed space-y-2 fade-in">
                  <p>
                    Orders placed before 2:00 PM EST dispatch same-day in protective luxury linen dust bags.
                  </p>
                  <p>
                    We gladly accept returns of unworn, unwashed pieces with all atelier tags intact within 30 days of arrival.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      {product.related && product.related.length > 0 && (
        <section className="mt-24 pt-16 border-t border-[#E8E6E1]">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">
              Harmonious Styling
            </span>
            <h2 className="font-serif text-3xl font-semibold text-[#101012] mt-1">
              Complete The Look
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {product.related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
