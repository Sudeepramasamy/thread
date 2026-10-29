import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, SlidersHorizontal, RotateCcw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract query filters from URL
  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const selectedSort = searchParams.get('sortBy') || 'featured';
  const selectedSize = searchParams.get('size') || '';
  const selectedColor = searchParams.get('color') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Helper to update search params
  const updateParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === 'all') {
        updated.delete(key);
      } else {
        updated.set(key, value.toString());
      }
    });
    // Reset to page 1 on filter changes unless changing page
    if (!newParams.page) {
      updated.delete('page');
    }
    setSearchParams(updated);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  // Fetch categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get('/categories');
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          sortBy: selectedSort,
          size: selectedSize || undefined,
          color: selectedColor || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          page: currentPage,
          limit: 12,
        };

        const res = await api.get('/products', { params });
        setProducts(res.data.items || []);
        setPagination({
          total: res.data.total,
          page: res.data.page,
          limit: res.data.limit,
          totalPages: res.data.totalPages,
        });
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [
    selectedCategory,
    searchQuery,
    selectedSort,
    selectedSize,
    selectedColor,
    minPrice,
    maxPrice,
    currentPage,
  ]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Black', code: '#101012' },
    { name: 'Cream', code: '#F4F2EC' },
    { name: 'Grey', code: '#808080' },
    { name: 'Khaki', code: '#C8B99D' },
    { name: 'Olive', code: '#4B5320' },
    { name: 'Brown', code: '#734128' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Header */}
      <div className="border-b border-[#E8E6E1] pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-500">
              Ready-to-Wear Atelier
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#101012] mt-1">
              The Collection
            </h1>
            {searchQuery && (
              <p className="text-xs text-gray-500 mt-2">
                Search results for &ldquo;<strong>{searchQuery}</strong>&rdquo;
              </p>
            )}
          </div>

          {/* Action Row: Count, Mobile Toggle, Sort */}
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              {pagination.total} {pagination.total === 1 ? 'Piece' : 'Pieces'} Found
            </span>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 border border-[#D5CEC0] bg-[#F4F2EC] text-xs font-semibold uppercase tracking-wider text-[#101012]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => updateParams({ sortBy: e.target.value })}
                className="appearance-none bg-white border border-[#D5CEC0] px-3.5 py-2 pr-8 text-xs font-medium uppercase tracking-wider text-[#101012] focus:outline-none focus:border-black rounded-sm cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 scrollbar-none">
          <button
            onClick={() => updateParams({ category: 'all' })}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-full transition-all flex-shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#101012] text-white shadow-sm'
                : 'bg-[#F3F1EC] text-[#4A463D] hover:bg-[#E8E4DA]'
            }`}
          >
            All Pieces
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParams({ category: cat.slug })}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-full transition-all flex-shrink-0 ${
                selectedCategory === cat.slug
                  ? 'bg-[#101012] text-white shadow-sm'
                  : 'bg-[#F3F1EC] text-[#4A463D] hover:bg-[#E8E4DA]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-8 pr-6 border-r border-[#EAE7E0]">
          {/* Active Filters Clear */}
          {(selectedCategory !== 'all' || selectedSize || selectedColor || minPrice || maxPrice || searchQuery) && (
            <div className="pb-4 border-b border-[#EAE7E0]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                  Active Filters
                </span>
                <button
                  onClick={handleClearFilters}
                  className="text-[11px] text-[#C5A880] hover:text-black flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#EAE7E0] text-[10px] uppercase font-semibold text-gray-800 rounded-sm">
                    {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateParams({ category: 'all' })} />
                  </span>
                )}
                {selectedSize && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#EAE7E0] text-[10px] uppercase font-semibold text-gray-800 rounded-sm">
                    Size: {selectedSize}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateParams({ size: '' })} />
                  </span>
                )}
                {selectedColor && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#EAE7E0] text-[10px] uppercase font-semibold text-gray-800 rounded-sm">
                    Color: {selectedColor}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateParams({ color: '' })} />
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#EAE7E0] text-[10px] uppercase font-semibold text-gray-800 rounded-sm">
                    ${minPrice || '0'} - ${maxPrice || '∞'}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateParams({ minPrice: '', maxPrice: '' })} />
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Size Filter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#101012] mb-3">
              Size
            </h4>
            <div className="grid grid-cols-5 gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => updateParams({ size: selectedSize === s ? '' : s })}
                  className={`py-2 text-xs font-semibold uppercase border rounded-sm transition-colors ${
                    selectedSize === s
                      ? 'bg-[#101012] text-white border-[#101012]'
                      : 'bg-white text-gray-700 border-[#D5CEC0] hover:border-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#101012] mb-3">
              Color
            </h4>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => updateParams({ color: selectedColor === c.name ? '' : c.name })}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 border rounded-sm text-xs transition-colors ${
                    selectedColor === c.name
                      ? 'border-black bg-[#EAE7E0] font-semibold text-black'
                      : 'border-[#D5CEC0] bg-white text-gray-700 hover:border-black'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: c.code }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#101012] mb-3">
              Price Range ($)
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateParams({ minPrice: e.target.value })}
                className="w-full bg-white border border-[#D5CEC0] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-black rounded-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateParams({ maxPrice: e.target.value })}
                className="w-full bg-white border border-[#D5CEC0] px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-black rounded-sm"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-sm mb-3" />
                  <div className="h-4 bg-gray-200 w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 w-1/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-[#F4F2EC] rounded-sm p-8">
              <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-2">
                No pieces found
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                We could not find any garment matching your selected filter combination.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Server-Side Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-8 border-t border-[#EAE7E0]">
                  <button
                    onClick={() => updateParams({ page: Math.max(1, currentPage - 1) })}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 border border-[#D5CEC0] text-xs font-semibold uppercase tracking-wider text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#EAE7E0] transition-colors rounded-sm"
                  >
                    Previous
                  </button>

                  {[...Array(pagination.totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => updateParams({ page: pageNum })}
                        className={`w-9 h-9 text-xs font-semibold transition-colors rounded-sm ${
                          currentPage === pageNum
                            ? 'bg-[#101012] text-white'
                            : 'border border-[#D5CEC0] text-gray-800 hover:bg-[#EAE7E0]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => updateParams({ page: Math.min(pagination.totalPages, currentPage + 1) })}
                    disabled={currentPage >= pagination.totalPages}
                    className="px-4 py-2 border border-[#D5CEC0] text-xs font-semibold uppercase tracking-wider text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#EAE7E0] transition-colors rounded-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#FAF9F5] shadow-xl p-6 flex flex-col justify-between slide-in-right">
              <div className="space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-[#101012]">
                    Filters
                  </h3>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Size */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-[#101012] mb-2">
                    Size
                  </h4>
                  <div className="grid grid-cols-5 gap-1">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateParams({ size: selectedSize === s ? '' : s })}
                        className={`py-1.5 text-xs font-semibold border rounded-sm ${
                          selectedSize === s ? 'bg-black text-white' : 'bg-white text-gray-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-[#101012] mb-2">
                    Color
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => updateParams({ color: selectedColor === c.name ? '' : c.name })}
                        className={`text-xs px-2.5 py-1 border rounded-sm ${
                          selectedColor === c.name ? 'bg-black text-white' : 'bg-white text-gray-700'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-[#101012] mb-2">
                    Price Range
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => updateParams({ minPrice: e.target.value })}
                      className="w-full bg-white border border-[#D5CEC0] px-2 py-1 text-xs"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => updateParams({ maxPrice: e.target.value })}
                      className="w-full bg-white border border-[#D5CEC0] px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E8E6E1] space-y-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#101012] text-white text-xs font-semibold uppercase tracking-widest"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClearFilters}
                  className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-black uppercase tracking-wider"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
