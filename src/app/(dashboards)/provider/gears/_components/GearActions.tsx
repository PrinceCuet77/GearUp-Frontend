'use client';

import { useState } from 'react';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteGear } from '../_actions/deleteGear';
import Modal from '@/components/Modal';

interface GearActionsProps {
  gearId: string;
  gearName: string;
  onEdit?: () => void;
}

export function GearActions({ gearId, gearName, onEdit }: GearActionsProps) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);

    const result = await deleteGear(gearId);

    if (result.success) {
      toast.success(`"${gearName}" removed from inventory.`);
      router.refresh();
    } else {
      toast.error(result.error ?? 'Failed to delete gear.');
    }

    setDeleting(false);
  };

  return (
    <>
      {/* Mobile view */}
      <div className='flex items-center gap-2 sm:hidden'>
        <button
          onClick={() => onEdit?.()}
          className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg transition-colors'
          style={{ color: 'var(--muted-foreground)' }}
        >
          <Pencil className='h-4 w-4' />
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={deleting}
          className='cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg transition-colors'
          style={{ color: 'var(--muted-foreground)' }}
        >
          {deleting ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Trash2 className='h-4 w-4' />
          )}
        </button>
      </div>

      {/* Desktop view */}
      <div className='hidden items-center gap-2 sm:flex'>
        <button
          onClick={() => onEdit?.()}
          className='cursor-pointer flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors'
          style={{
            backgroundColor: 'var(--muted)',
            color: 'var(--foreground)',
          }}
        >
          <Pencil className='h-3 w-3' />
          Edit
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={deleting}
          className='cursor-pointer flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors disabled:opacity-50'
          style={{
            backgroundColor: 'rgba(239,68,68,0.08)',
            color: '#ef4444',
          }}
        >
          {deleting ? (
            <Loader2 className='h-3 w-3 animate-spin' />
          ) : (
            <Trash2 className='h-3 w-3' />
          )}
          Delete
        </button>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title='Delete Gear'
        noFooter
      >
        <div className='space-y-4'>
          <p className='text-sm' style={{ color: 'var(--foreground)' }}>
            Are you sure you want to delete this gear named{' '}
            <strong className='text-red-400'>{gearName}</strong>? This action
            cannot be undone.
          </p>
        </div>
        <div className='flex justify-end gap-3'>
          <button
            onClick={() => setConfirmDelete(false)}
            className='rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer'
            style={{
              backgroundColor: 'var(--muted)',
              color: 'var(--foreground)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className='inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 cursor-pointer'
          >
            {deleting && <Loader2 className='h-4 w-4 animate-spin' />}
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
