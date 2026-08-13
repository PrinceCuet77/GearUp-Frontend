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
import { FormField } from '@/components/ui/FormField';
import { cn } from '@/lib/cn';
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
  // listing - an effect would flash the previously edited gear for one frame.
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

  /** Clears a field's error as soon as the user edits it. */
  const clearError = (field: keyof FormErrors) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

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
        noValidate
      >
        <FormField label='Gear name' error={errors.name} required>
          {(props) => (
            <input
              {...props}
              type='text'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError('name');
              }}
              placeholder='e.g., Mountain Bike 26"'
              maxLength={100}
            />
          )}
        </FormField>

        <FormField label='Description' error={errors.description} required>
          {(props) => (
            <textarea
              {...props}
              className={cn(props.className, 'resize-none')}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                clearError('description');
              }}
              rows={3}
              maxLength={255}
              placeholder='Describe the gear, its condition, and any special notes…'
            />
          )}
        </FormField>

        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField label='Price per day (৳)' error={errors.price} required>
            {(props) => (
              <input
                {...props}
                type='number'
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  clearError('price');
                }}
                min='0.01'
                step='0.01'
                placeholder='25'
              />
            )}
          </FormField>

          <FormField label='Stock quantity' error={errors.stock} required>
            {(props) => (
              <input
                {...props}
                type='number'
                value={stock}
                onChange={(e) => {
                  setStock(e.target.value);
                  clearError('stock');
                }}
                min='0'
                placeholder='1'
              />
            )}
          </FormField>
        </div>

        <FormField label='Category' error={errors.categoryId} required>
          {(props) => (
            <select
              {...props}
              className={cn(props.className, 'h-11 cursor-pointer py-0')}
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                clearError('categoryId');
              }}
            >
              <option value=''>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField
          label='Image URL'
          error={errors.images}
          hint='Provide a direct link to the gear image.'
          required
        >
          {(props) => (
            <input
              {...props}
              type='url'
              value={images}
              onChange={(e) => {
                setImages(e.target.value);
                clearError('images');
              }}
              placeholder='https://example.com/gear-image.jpg'
              maxLength={255}
            />
          )}
        </FormField>

        {/* Active toggle */}
        <div className='flex flex-col gap-3 rounded-control border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
          <div>
            <p className='text-sm font-semibold text-foreground'>
              Active Listing
            </p>
            <p className='text-xs text-muted-foreground'>
              Customers can browse and rent this gear when active.
            </p>
          </div>
          <button
            type='button'
            onClick={() => setIsActive((v) => !v)}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors',
              isActive ? 'bg-primary' : 'bg-muted',
            )}
            role='switch'
            aria-checked={isActive}
            aria-label='Active listing'
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                isActive ? 'translate-x-[1.375rem]' : 'translate-x-1',
              )}
            />
          </button>
        </div>
      </form>
    </Modal>
  );
}
