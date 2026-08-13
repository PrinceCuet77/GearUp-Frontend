'use client';

/**
 * Full-screen image preview modal.
 * Only has an × button in the top-right corner.
 * Clicking the backdrop or pressing Escape also closes it.
 */

import { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
}

export default function ImageModal({
  open,
  onClose,
  src,
  alt = 'Image preview',
}: ImageModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      style={{ backgroundColor: 'rgba(0,0,0,0.88)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Blur layer */}
      <div className='pointer-events-none absolute inset-0 backdrop-blur-md' />

      {/* Panel */}
      <div className='relative z-10 w-full max-w-5xl'>
        {/* × close button - top-right */}
        <button
          onClick={onClose}
          aria-label='Close image preview'
          className='absolute -right-2 -top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors cursor-pointer'
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'rgba(0,0,0,0.9)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'rgba(0,0,0,0.7)';
          }}
        >
          <X className='h-5 w-5' />
        </button>

        {/* Image */}
        <div
          className='overflow-hidden rounded-2xl'
          style={{ aspectRatio: '16 / 10' }}
        >
          <div className='relative h-full w-full'>
            <Image
              src={src}
              alt={alt}
              fill
              className='object-contain'
              sizes='(max-width: 1280px) 100vw, 80vw'
              priority
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://placehold.co/1280x720/e2e8f0/94a3b8?text=Image';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
