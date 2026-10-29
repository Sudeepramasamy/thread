import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, AlertTriangle, FolderTree } from 'lucide-react';
import api from '../../services/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', imageUrl: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', imageUrl: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setFormError('Category name is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
      };

      if (editingCategory) {
        await api.patch(`/categories/${editingCategory.id}`, payload);
      } else {
        await api.post('/categories', payload);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category', err);
      const msg = err.response?.data?.message || 'Failed to save category.';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (cat._count?.products > 0) {
      alert(`Cannot delete '${cat.name}' because it contains ${cat._count.products} products. Reassign or delete products first.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete category '${cat.name}'?`)) {
      return;
    }

    try {
      await api.delete(`/categories/${cat.id}`);
      fetchCategories();
    } catch (err) {
      console.error('Delete category failed', err);
      const msg = err.response?.data?.message || 'Failed to delete category.';
      alert(msg);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E0DCD3] gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8E826C] font-semibold">
            Catalog Taxonomy
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#101012] mt-0.5">
            Categories ({categories.length})
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#101012] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black rounded-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid / Table */}
      <div className="bg-[#FAF9F5] border border-[#E8E6E1] rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No categories defined yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0EEE8] text-gray-700 uppercase tracking-wider text-[10px] border-b border-[#E8E6E1]">
                <tr>
                  <th className="py-3 px-4">Banner</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Products</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE7E0]">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-white transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="w-12 h-10 bg-gray-200 rounded-sm overflow-hidden">
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FolderTree className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-gray-900">{c.name}</td>
                    <td className="py-2.5 px-4 font-mono text-gray-500">{c.slug}</td>
                    <td className="py-2.5 px-4 text-gray-600 max-w-sm truncate">
                      {c.description || '—'}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-800 font-semibold">
                        {c._count?.products || 0}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded"
                        title={c._count?.products > 0 ? 'Cannot delete categories with products' : 'Delete'}
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

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-[#FAF9F5] rounded-sm border border-[#E8E6E1] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#EAE7E0] pb-3">
              <h2 className="font-serif text-lg font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
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

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Silk Loungewear"
                  required
                  className="w-full bg-white border border-[#D5CEC0] px-3 py-2 rounded-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                  Slug (Optional)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="silk-loungewear"
                  className="w-full bg-white border border-[#D5CEC0] px-3 py-2 rounded-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-[#D5CEC0] px-3 py-2 rounded-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of pieces in this category..."
                  className="w-full bg-white border border-[#D5CEC0] px-3 py-2 rounded-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE7E0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D5CEC0] uppercase font-semibold text-gray-700 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#101012] text-white uppercase font-semibold rounded-sm hover:bg-black transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
