'use client';

import { useState } from 'react';
import { Tag, PlusCircle, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FormField } from '@/components/ui/FormField';
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

  return (
    <div>
      <PageHeader
        title='Categories'
        description={`${categories.length} gear categor${categories.length !== 1 ? 'ies' : 'y'}`}
        action={
          <Button
            onClick={openCreate}
            leadingIcon={<PlusCircle className='h-4 w-4' />}
          >
            New Category
          </Button>
        }
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
        <form
          className='flex flex-col gap-4'
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <FormField label='Name' error={errors.name} required>
            {(props) => (
              <input
                {...props}
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g., Cycling'
                maxLength={100}
              />
            )}
          </FormField>

          <FormField
            label='Description'
            error={errors.description}
            hint='Optional — shown to customers when browsing.'
          >
            {(props) => (
              <input
                {...props}
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Short description (optional)'
                maxLength={255}
              />
            )}
          </FormField>
        </form>
      </Modal>

      {categories.length === 0 ? (
        <EmptyState
          icon={Tag}
          title='No categories yet'
          description='Create your first gear category so providers can list their equipment under it.'
          action={
            <Button
              onClick={openCreate}
              size='sm'
              leadingIcon={<PlusCircle className='h-3.5 w-3.5' />}
            >
              New Category
            </Button>
          }
        />
      ) : (
        <div className='surface-card overflow-hidden'>
          <ul className='divide-y divide-border'>
            {categories.map((cat) => (
              <li
                key={cat.id}
                className='flex items-center justify-between gap-4 px-5 py-4'
              >
                <div className='min-w-0'>
                  <p className='text-sm font-semibold text-foreground'>
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p className='mt-0.5 text-xs text-muted-foreground'>
                      {cat.description}
                    </p>
                  )}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => openEdit(cat)}
                  leadingIcon={<Pencil className='h-3 w-3' />}
                  aria-label={`Edit ${cat.name}`}
                >
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
