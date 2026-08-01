'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tag, PlusCircle, Pencil, Loader2, X, Save } from 'lucide-react';
import { CategorySkeleton } from '@/components/Skeleton';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/PageHeader';
import type { Category } from '@/lib/types';
import { DUMMY_CATEGORIES } from '@/lib/dummy-data';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 150));
    setCategories(DUMMY_CATEGORIES);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setShowForm(true);
  };
  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description ?? '');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    toast.success(
      editingId ? 'Category updated. (demo)' : 'Category created. (demo)',
    );
    if (editingId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, name, description: description || null }
            : c,
        ),
      );
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: `cat-${Date.now()}`,
          name,
          description: description || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }
    setShowForm(false);
    setSaving(false);
  };

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    color: 'var(--foreground)',
  };

  return (
    <div>
      <PageHeader
        title='Categories'
        description={`${categories.length} gear categor${categories.length !== 1 ? 'ies' : 'y'}`}
        action={
          <button
            onClick={openCreate}
            className='inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition-colors cursor-pointer'
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <PlusCircle className='h-4 w-4' />
            New Category
          </button>
        }
      />

      {showForm && (
        <div
          className='mb-6 rounded-xl border p-5'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <div className='mb-4 flex items-center justify-between'>
            <h2
              className='text-sm font-semibold'
              style={{ color: 'var(--foreground)' }}
            >
              {editingId ? 'Edit Category' : 'New Category'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className='cursor-pointer flex h-7 w-7 items-center justify-center rounded-lg transition-colors'
              style={{ color: 'var(--muted-foreground)' }}
            >
              <X className='h-4 w-4' />
            </button>
          </div>
          <form
            onSubmit={handleSave}
            className='flex flex-col gap-4 sm:flex-row sm:items-end'
          >
            <div className='flex-1'>
              <label
                className='mb-1.5 block text-xs font-medium'
                style={{ color: 'var(--foreground)' }}
              >
                Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder='e.g., Cycling'
                className='h-9 w-full rounded-lg border px-3 text-sm outline-none'
                style={inputStyle}
              />
            </div>
            <div className='flex-1'>
              <label
                className='mb-1.5 block text-xs font-medium'
                style={{ color: 'var(--foreground)' }}
              >
                Description
              </label>
              <input
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Short description (optional)'
                className='h-9 w-full rounded-lg border px-3 text-sm outline-none'
                style={inputStyle}
              />
            </div>
            <button
              type='submit'
              disabled={saving}
              className='inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-60'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {saving ? (
                <Loader2 className='h-3.5 w-3.5 animate-spin' />
              ) : (
                <Save className='h-3.5 w-3.5' />
              )}
              {editingId ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      <div
        className='rounded-xl border'
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {loading ? (
          <CategorySkeleton rows={5} />
        ) : categories.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <Tag
              className='mb-3 h-10 w-10 opacity-30'
              style={{ color: 'var(--muted-foreground)' }}
            />
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--muted-foreground)' }}
            >
              No categories yet
            </p>
          </div>
        ) : (
          <ul className='divide-y' style={{ borderColor: 'var(--border)' }}>
            {categories.map((cat) => (
              <li
                key={cat.id}
                className='flex items-center justify-between px-5 py-4'
              >
                <div>
                  <p
                    className='text-sm font-semibold'
                    style={{ color: 'var(--foreground)' }}
                  >
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p
                      className='mt-0.5 text-xs'
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {cat.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => openEdit(cat)}
                  className='cursor-pointer flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors'
                  style={{
                    backgroundColor: 'var(--muted)',
                    color: 'var(--foreground)',
                  }}
                >
                  <Pencil className='h-3 w-3' />
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
