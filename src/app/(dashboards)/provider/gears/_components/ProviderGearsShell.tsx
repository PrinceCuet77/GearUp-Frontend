'use client';

import { useState, createContext, useContext } from 'react';
import { PlusCircle } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/Button';
import { GearFormModal } from './GearFormModal';
import type { GearItem, Category } from '@/lib/types';

const GearEditContext = createContext<((gear: GearItem) => void) | null>(null);
const GearAddContext = createContext<(() => void) | null>(null);

export function useGearEdit() {
  return useContext(GearEditContext);
}

export function useGearAdd() {
  return useContext(GearAddContext);
}

interface ProviderGearsShellProps {
  children: React.ReactNode;
  total: number;
  categories: Category[];
}

export function ProviderGearsShell({
  children,
  total,
  categories,
}: ProviderGearsShellProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGear, setEditingGear] = useState<GearItem | null>(null);

  const handleOpenAdd = () => {
    setEditingGear(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (gear: GearItem) => {
    setEditingGear(gear);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingGear(null);
  };

  return (
    <div>
      <PageHeader
        title='My Gear'
        description={`${total} listing${total === 1 ? '' : 's'} in your inventory.`}
        action={
          <Button
            onClick={handleOpenAdd}
            leadingIcon={<PlusCircle className='h-4 w-4' aria-hidden='true' />}
          >
            Add Gear
          </Button>
        }
      />

      <GearEditContext.Provider value={handleOpenEdit}>
        <GearAddContext.Provider value={handleOpenAdd}>
          {children}
        </GearAddContext.Provider>
      </GearEditContext.Provider>

      <GearFormModal
        open={modalOpen}
        onClose={handleClose}
        gear={editingGear}
        categories={categories}
      />
    </div>
  );
}
