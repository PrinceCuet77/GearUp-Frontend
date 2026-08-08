'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import type { GearItem, Category } from '@/lib/types';
import {
  createGearSchema,
  updateGearSchema,
  type CreateGearValues,
  type UpdateGearValues,
} from '@/lib/validations/gear';
import { createGear } from '../_actions/createGear';
import { updateGearById } from '../_actions/updateGearById';

interface GearFormModalProps {
  open: boolean;
  onClose: () => void;
  gear?: GearItem | null;
  categories: Category[];
}

type FormErrors = Partial<
  Record<keyof (CreateGearValues & UpdateGearValues), string>
>;

const inputStyle = {
  backgroundColor: 'var(--input-bg, var(--card))',
  borderColor: 'var(--input-border, var(--border))',
  color: 'var(--foreground)',
};

export function GearFormModal({
  open,
  onClose,
  gear,
  categories,
}: GearFormModalProps) {
  const router = useRouter();
  const isEdit = Boolean(gear);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [images, setImages] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  // Populate the form when editing, or clear it when adding. Adjusting during
  // render means the modal's first painted frame already holds the right
  // listing — an effect would flash the previously edited gear for one frame.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setName(gear?.name ?? '');
      setDescription(gear?.description ?? '');
      setPrice(gear ? String(gear.price) : '');
      setStock(gear ? String(gear.stock) : '1');
      setImages(gear?.images ?? '');
      setCategoryId(gear?.categoryId ?? '');
      setIsActive(gear?.isActive ?? true);
      setErrors({});
    }
  }

  const validate = (): boolean => {
    const schema = isEdit ? updateGearSchema : createGearSchema;
    const rawData: Record<string, unknown> = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      images,
      categoryId,
    };
    rawData.isActive = isActive;
    const parsed = schema.safeParse(rawData);

    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);

    const payload = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      images,
      categoryId,
      isActive,
    };

    let result;

    if (isEdit && gear) {
      result = await updateGearById(gear.id, payload);
    } else {
      result = await createGear(payload);
    }

    if (result.success) {
      toast.success(
        isEdit
          ? `"${name}" updated successfully.`
          : `"${name}" added to inventory.`,
      );
      onClose();
      router.refresh();
    } else {
      toast.error(result.error ?? 'Something went wrong. Please try again.');
    }

    setSaving(false);
  };

  const fieldClass =
    'h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors';

  return (
    <Modal
      open={open}
      onClose={() => !saving && onClose()}
      title={isEdit ? 'Edit Gear' : 'Add New Gear'}
      onSave={handleSubmit}
      saveLabel={isEdit ? 'Save Changes' : 'Add Gear'}
      cancelLabel='Cancel'
      saving={saving}
      maxWidth='max-w-lg'
      footerRight
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className='space-y-4'
        id='gear-form-modal'
      >
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
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name)
                setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder='e.g., Mountain Bike 26"'
            maxLength={100}
            className={`${fieldClass} ${errors.name ? 'border-red-500' : ''}`}
            style={inputStyle}
          />
          {errors.name && (
            <p className='mt-1 text-xs' style={{ color: '#ef4444' }}>
              {errors.name}
            </p>
          )}
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
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description)
                setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            rows={3}
            maxLength={255}
            placeholder='Describe the gear, its condition, and any special notes…'
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors resize-none ${errors.description ? 'border-red-500' : ''}`}
            style={inputStyle}
          />
          {errors.description && (
            <p className='mt-1 text-xs' style={{ color: '#ef4444' }}>
              {errors.description}
            </p>
          )}
        </div>

        {/* Price + Stock */}
        <div className='grid gap-4 sm:grid-cols-2'>
          <div>
            <label
              className='mb-1.5 block text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Price per Day (৳) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type='number'
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (errors.price)
                  setErrors((prev) => ({ ...prev, price: undefined }));
              }}
              min='0.01'
              step='0.01'
              placeholder='25'
              className={`${fieldClass} ${errors.price ? 'border-red-500' : ''}`}
              style={inputStyle}
            />
            {errors.price && (
              <p className='mt-1 text-xs' style={{ color: '#ef4444' }}>
                {errors.price}
              </p>
            )}
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
              onChange={(e) => {
                setStock(e.target.value);
                if (errors.stock)
                  setErrors((prev) => ({ ...prev, stock: undefined }));
              }}
              min='0'
              placeholder='1'
              className={`${fieldClass} ${errors.stock ? 'border-red-500' : ''}`}
              style={inputStyle}
            />
            {errors.stock && (
              <p className='mt-1 text-xs' style={{ color: '#ef4444' }}>
                {errors.stock}
              </p>
            )}
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
            onChange={(e) => {
              setCategoryId(e.target.value);
              if (errors.categoryId)
                setErrors((prev) => ({ ...prev, categoryId: undefined }));
            }}
            className={`h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors ${errors.categoryId ? 'border-red-500' : ''}`}
            style={inputStyle}
          >
            <option value=''>Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className='mt-1 text-xs' style={{ color: '#ef4444' }}>
              {errors.categoryId}
            </p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label
            className='mb-1.5 block text-sm font-medium'
            style={{ color: 'var(--foreground)' }}
          >
            Image URL <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type='text'
            value={images}
            onChange={(e) => {
              setImages(e.target.value);
              if (errors.images)
                setErrors((prev) => ({ ...prev, images: undefined }));
            }}
            placeholder='https://example.com/gear-image.jpg'
            maxLength={255}
            className={`${fieldClass} ${errors.images ? 'border-red-500' : ''}`}
            style={inputStyle}
          />
          {errors.images && (
            <p className='mt-1 text-xs' style={{ color: '#ef4444' }}>
              {errors.images}
            </p>
          )}
          <p
            className='mt-1 text-xs'
            style={{ color: 'var(--muted-foreground)' }}
          >
            Provide a direct link to the gear image.
          </p>
        </div>

        {/* Active toggle */}
        <div
          className='flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0'
          style={{ borderColor: 'var(--border)' }}
        >
          <div>
            <p
              className='text-sm font-medium'
              style={{ color: 'var(--foreground)' }}
            >
              Active Listing
            </p>
            <p className='text-xs' style={{ color: 'var(--muted-foreground)' }}>
              Customers can browse and rent this gear when active.
            </p>
          </div>
          <button
            type='button'
            onClick={() => setIsActive((v) => !v)}
            className='relative cursor-pointer inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors'
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
      </form>
    </Modal>
  );
}
