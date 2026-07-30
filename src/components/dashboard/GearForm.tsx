'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { GearItem, Category } from '@/lib/types';
import { DUMMY_CATEGORIES } from '@/lib/dummy-data';

interface GearFormProps {
  gear?: GearItem;
}

export function GearForm({ gear }: GearFormProps) {
  const router = useRouter();
  const isEdit = Boolean(gear);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(gear?.name ?? '');
  const [description, setDescription] = useState(gear?.description ?? '');
  const [price, setPrice] = useState(gear?.price ?? '');
  const [stock, setStock] = useState(String(gear?.stock ?? 1));
  const [images, setImages] = useState(gear?.images ?? '');
  const [categoryId, setCategoryId] = useState(gear?.categoryId ?? '');
  const [isActive, setIsActive] = useState(gear?.isActive ?? true);

  useEffect(() => {
    setCategories(DUMMY_CATEGORIES);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      toast.error('Please select a category.');
      return;
    }
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    toast.success(
      isEdit
        ? 'Gear updated successfully. (demo)'
        : 'Gear added to inventory. (demo)',
    );
    router.push('/provider/gear');
    setLoading(false);
  };

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    color: 'var(--foreground)',
  };

  return (
    <div className='mx-auto max-w-2xl'>
      <Link
        href='/provider/gear'
        className='mb-6 inline-flex items-center gap-1.5 text-sm font-medium'
        style={{ color: 'var(--muted-foreground)' }}
      >
        <ArrowLeft className='h-4 w-4' />
        Back to Inventory
      </Link>

      <div
        className='rounded-xl border p-6'
        style={{
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <h1
          className='mb-6 text-xl font-bold'
          style={{ color: 'var(--foreground)' }}
        >
          {isEdit ? 'Edit Gear' : 'Add New Gear'}
        </h1>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Name */}
          <div>
            <label
              className='mb-1.5 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Gear Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder='e.g., Mountain Bike 26"'
              className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors'
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label
              className='mb-1.5 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder='Describe the gear, its condition, and any special notes…'
              className='w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors resize-none'
              style={inputStyle}
            />
          </div>

          {/* Price + Stock row */}
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label
                className='mb-1.5 block text-sm font-medium'
                style={{ color: 'var(--foreground)' }}
              >
                Price per Day ($) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type='number'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min='0.01'
                step='0.01'
                placeholder='25.00'
                className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors'
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className='mb-1.5 block text-sm font-medium'
                style={{ color: 'var(--foreground)' }}
              >
                Stock Quantity <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type='number'
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                min='0'
                placeholder='1'
                className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors'
                style={inputStyle}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              className='mb-1.5 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Category <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors'
              style={inputStyle}
            >
              <option value=''>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div>
            <label
              className='mb-1.5 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Image URL <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type='url'
              value={images}
              onChange={(e) => setImages(e.target.value)}
              required
              placeholder='https://example.com/gear-image.jpg'
              className='h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors'
              style={inputStyle}
            />
            <p
              className='mt-1 text-xs'
              style={{ color: 'var(--muted-foreground)' }}
            >
              Provide a direct link to the gear image.
            </p>
          </div>

          {/* Active toggle (edit only) */}
          {isEdit && (
            <div
              className='flex items-center justify-between rounded-lg border px-4 py-3'
              style={{ borderColor: 'var(--border)' }}
            >
              <div>
                <p
                  className='text-sm font-medium'
                  style={{ color: 'var(--foreground)' }}
                >
                  Active Listing
                </p>
                <p
                  className='text-xs'
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Customers can browse and rent this gear when active.
                </p>
              </div>
              <button
                type='button'
                onClick={() => setIsActive((v) => !v)}
                className='relative inline-flex h-6 w-11 items-center rounded-full transition-colors'
                style={{
                  backgroundColor: isActive ? 'var(--primary)' : 'var(--muted)',
                }}
                role='switch'
                aria-checked={isActive}
              >
                <span
                  className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform'
                  style={{
                    transform: isActive
                      ? 'translateX(1.375rem)'
                      : 'translateX(0.25rem)',
                  }}
                />
              </button>
            </div>
          )}

          <div className='flex justify-end gap-3 pt-2'>
            <Link
              href='/provider/gear'
              className='inline-flex h-10 items-center rounded-lg border px-5 text-sm font-semibold transition-colors'
              style={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
              }}
            >
              Cancel
            </Link>
            <button
              type='submit'
              disabled={loading}
              className='inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition-colors disabled:opacity-60'
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {loading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Save className='h-4 w-4' />
              )}
              {isEdit ? 'Update Gear' : 'Add Gear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
