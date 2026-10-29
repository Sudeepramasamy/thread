import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Check,
  Image as ImageIcon,
  ChevronDown,
} from 'lucide-react';
import api from '../../services/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: '',
    price: '',
    discountPrice: '',
    stock: '',
    description: '',
    imageUrl: '',
    isFeatured: false,
    isActive: true,
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products', {
        params: {
          search: search || undefined,
          category: selectedCat !== 'all' ? selectedCat : undefined,
          limit: 50,
          isActive: '', // Fetch all for admin
        },
      });
      setProducts(res.data.items || []);
    } catch (err) {
      console.error('Failed to fetch admin products', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
      if (res.data.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: res.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCat]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      categoryId: categories[0]?.id || '',
      price: '',
      discountPrice: '',
      stock: '25',
      description: '',
      imageUrl: '',
      isFeatured: false,
      isActive: true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      categoryId: p.categoryId,
      price: Number(p.price).toString(),
      discountPrice: p.discountPrice ? Number(p.discountPrice).toString() : '',
      stock: p.stock.toString(),
      description: p.description,
      imageUrl: p.images?.[0]?.url || '',
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.price || !formData.description) {
      setFormError('Please fill all mandatory fields (Name, Category, Price, Description).');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stock: parseInt(formData.stock, 10) || 0,
        description: formData.description.trim(),
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        images: formData.imageUrl.trim()
          ? [{ url: formData.imageUrl.trim(), isPrimary: true }]
          : undefined,
      };

      if (editingProduct) {
        await api.patch(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product', err);
      const msg = err.response?.data?.message || 'Failed to save product.';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete.id}`);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product', err);
      alert('Failed to delete product.');
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E0DCD3] gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E826C] font-semibold">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#101012] mt-0.5">
            Products ({products.length})
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#101012] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black rounded-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Piece</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF9F5] p-4 border border-[#E8E6E1] rounded-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#D5CEC0] px-3 py-1.5 text-xs text-gray-900 rounded-sm focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#101012] text-white text-xs uppercase font-semibold rounded-sm hover:bg-black"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-white border border-[#D5CEC0] px-3 py-1.5 text-xs rounded-sm focus:outline-none focus:border-black"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#FAF9F5] border border-[#E8E6E1] rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading catalog pieces...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No products match the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0EEE8] text-gray-700 uppercase tracking-wider text-[10px] border-b border-[#E8E6E1]">
                <tr>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Garment Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE7E0]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="w-10 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop'}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-medium text-gray-900 max-w-xs truncate">
                      {p.name}
                      {p.isFeatured && (
                        <span className="ml-2 text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold uppercase">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-gray-600">{p.category?.name}</td>
                    <td className="py-2.5 px-4 font-semibold text-gray-900">
                      ${Number(p.price).toFixed(2)}
                      {p.discountPrice && (
                        <span className="block text-[10px] text-gray-400 line-through">
                          ${Number(p.discountPrice).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`font-semibold ${
                          p.stock <= 5 ? 'text-red-700' : 'text-gray-900'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-sm uppercase text-[9px] font-semibold ${
                          p.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded"
                        title="Edit piece"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setProductToDelete(p);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-[#FAF9F5] rounded-sm border border-[#E8E6E1] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#EAE7E0] pb-4">
              <h2 className="font-serif text-xl font-semibold text-[#101012]">
                {editingProduct ? 'Edit Catalog Piece' : 'Add New Garment'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Double-Faced Cashmere Coat"
                    className="w-full bg-white border border-[#D5CEC0] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-white border border-[#D5CEC0] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-black"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="395.00"
                    className="w-full bg-white border border-[#D5CEC0] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                    Sale Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="Optional discount"
                    className="w-full bg-white border border-[#D5CEC0] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    placeholder="25"
                    className="w-full bg-white border border-[#D5CEC0] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                  Primary Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-[#D5CEC0] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Tailoring cut, fabric origin, and button details..."
                  className="w-full bg-white border border-[#D5CEC0] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-black focus:ring-black"
                  />
                  <span>Featured on Home Page Spotlight</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-black focus:ring-black"
                  />
                  <span>Active (Visible in Storefront)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-[#EAE7E0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D5CEC0] text-xs font-semibold uppercase tracking-wider text-gray-700 rounded-sm hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#101012] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-black transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-[#FAF9F5] rounded-sm border border-[#E8E6E1] max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-semibold text-gray-900">
              Confirm Deletion
            </h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to remove &ldquo;<strong>{productToDelete?.name}</strong>&rdquo; from the atelier catalog? This action cannot be reversed.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE7E0]">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-[#D5CEC0] text-xs uppercase font-semibold text-gray-700 rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-red-700 text-white text-xs uppercase font-semibold rounded-sm hover:bg-red-800"
              >
                Delete Piece
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
