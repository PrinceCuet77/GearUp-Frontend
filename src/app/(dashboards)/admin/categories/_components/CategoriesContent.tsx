'use client';

import { useState } from 'react';
import { Tag, PlusCircle, Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import Modal from '@/components/Modal';
import type { Category } from '@/lib/types';
import {
  createCategorySchema,
  updateCategorySchema,
} from '@/lib/validations/category';

import { createCategory } from '../_actions/createCategory';
import { updateCategory } from '../_actions/updateCategory';

interface CategoriesContentProps {
  initialCategories: Category[];
  initialError?: string | null;
}

export function CategoriesContent({
  initialCategories,
  initialError = null,
}: CategoriesContentProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [error] = useState<string | null>(initialError);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {},
  );

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setErrors({});
    setShowForm(true);
  };
  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description ?? '');
    setErrors({});
    setShowForm(true);
  };

  const handleSave = async () => {
    setErrors({});
    const schema = editingId ? updateCategorySchema : createCategorySchema;
    const validation = schema.safeParse({
      name,
      description: description || undefined,
    });

    if (!validation.success) {
      const fieldErrors: { name?: string; description?: string } = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path === 'name') fieldErrors.name = issue.message;
        if (path === 'description') fieldErrors.description = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);

    if (editingId) {
      const result = await updateCategory(
        editingId,
        validation.data.name || name,
        validation.data.description || '',
      );
      if (result.success) {
        toast.success('Category updated successfully.');
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingId
              ? {
                  ...c,
                  name: validation.data.name || name,
                  description: validation.data.description || null,
                  updatedAt: result.data!.updatedAt,
                }
              : c,
          ),
        );
      } else {
        toast.error(result.error ?? 'Failed to update category.');
      }
    } else {
      const result = await createCategory(
        validation.data.name || name,
        validation.data.description || '',
      );
      if (result.success) {
        toast.success('Category created successfully.');
        setCategories((prev) => [...prev, result.data!]);
      } else {
        toast.error(result.error ?? 'Failed to create category.');
      }
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
      />

      {error && (
        <ErrorBanner
          message={error}
          title='Could not load categories'
          showToast={true}
        />
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editingId ? 'Edit Category' : 'New Category'}
        onSave={handleSave}
        saving={saving}
        saveLabel={editingId ? 'Update' : 'Create'}
        footerRight
      >
        <div className='flex flex-col gap-4'>
          <div>
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
              placeholder='e.g., Cycling'
              className='h-9 w-full rounded-lg border px-3 text-sm outline-none'
              style={{
                ...inputStyle,
                borderColor: errors.name ? '#ef4444' : 'var(--input-border)',
              }}
            />
            {errors.name && (
              <p className='mt-1 text-xs text-red-500'>{errors.name}</p>
            )}
          </div>
          <div>
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
              style={{
                ...inputStyle,
                borderColor: errors.description
                  ? '#ef4444'
                  : 'var(--input-border)',
              }}
            />
            {errors.description && (
              <p className='mt-1 text-xs text-red-500'>{errors.description}</p>
            )}
          </div>
        </div>
      </Modal>

      <div className='flex flex-col gap-4'>
        {/* Add button – bottom-right */}
        <div className='flex justify-end'>
          <button
            onClick={openCreate}
            className='inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition-colors cursor-pointer'
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <PlusCircle className='h-4 w-4' />
            New Category
          </button>
        </div>

        <div
          className='rounded-xl border'
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          {categories.length === 0 ? (
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
    </div>
  );
}
