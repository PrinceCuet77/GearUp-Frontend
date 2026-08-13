'use client';

import { useState } from 'react';
import { Pencil, PlusCircle, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { ErrorBanner } from '@/components/dashboard/ErrorBanner';
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable';
import { Pagination } from '@/components/dashboard/Pagination';
import { TableToolbar } from '@/components/dashboard/TableToolbar';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { useClientTable } from '@/lib/hooks';
import { formatShortDate } from '@/lib/gear-utils';
import type { Category } from '@/lib/types';
import {
  createCategorySchema,
  updateCategorySchema,
} from '@/lib/validations/category';

import { createCategory } from '../_actions/createCategory';
import { updateCategory } from '../_actions/updateCategory';

const PAGE_SIZE = 10;

const DESCRIBED_OPTIONS = [
  { value: '', label: 'All categories' },
  { value: 'described', label: 'With description' },
  { value: 'bare', label: 'Missing description' },
];

interface CategoriesContentProps {
  initialCategories: Category[];
  initialError?: string | null;
}

export function CategoriesContent({
  initialCategories,
  initialError = null,
}: CategoriesContentProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {},
  );

  const table = useClientTable(categories, {
    pageSize: PAGE_SIZE,
    searchAccessor: (category) =>
      `${category.name} ${category.description ?? ''}`,
    filters: [
      {
        key: 'described',
        label: 'Description',
        options: DESCRIBED_OPTIONS,
        accessor: (category) => (category.description ? 'described' : 'bare'),
      },
    ],
    sorters: {
      name: (category) => category.name,
      createdAt: (category) => new Date(category.createdAt).getTime(),
    },
    initialSort: { key: 'name', direction: 'asc' },
  });

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description ?? '');
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
        setCategories((previous) =>
          previous.map((category) =>
            category.id === editingId
              ? {
                  ...category,
                  name: validation.data.name || name,
                  description: validation.data.description || null,
                  updatedAt: result.data!.updatedAt,
                }
              : category,
          ),
        );
        setShowForm(false);
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
        setCategories((previous) => [...previous, result.data!]);
        setShowForm(false);
      } else {
        toast.error(result.error ?? 'Failed to create category.');
      }
    }

    setSaving(false);
  };

  const columns: Array<DataTableColumn<Category>> = [
    {
      id: 'name',
      header: 'Category',
      sortable: true,
      cell: (category) => (
        <div className='flex items-center gap-3'>
          <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-primary-soft'>
            <Tag className='h-4 w-4 text-primary' aria-hidden='true' />
          </span>
          <span className='font-medium text-foreground'>{category.name}</span>
        </div>
      ),
    },
    {
      id: 'description',
      header: 'Description',
      cell: (category) => (
        <span className='block max-w-md truncate text-muted-foreground'>
          {category.description || 'No description yet'}
        </span>
      ),
    },
    {
      id: 'createdAt',
      header: 'Created',
      hideBelow: 'md',
      sortable: true,
      cell: (category) => (
        <span className='whitespace-nowrap text-muted-foreground'>
          {formatShortDate(category.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      srOnlyHeader: true,
      cell: (category) => (
        <Button
          variant='outline'
          size='sm'
          onClick={() => openEdit(category)}
          leadingIcon={<Pencil className='h-3 w-3' aria-hidden='true' />}
          aria-label={`Edit ${category.name}`}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title='Categories'
        description={`${categories.length} gear categor${categories.length === 1 ? 'y' : 'ies'} available to providers.`}
        action={
          <Button
            onClick={openCreate}
            leadingIcon={<PlusCircle className='h-4 w-4' aria-hidden='true' />}
          >
            New Category
          </Button>
        }
      />

      {initialError && (
        <ErrorBanner message={initialError} title='Could not load categories' />
      )}

      <TableToolbar
        searchValue={table.search}
        onSearchChange={table.setSearch}
        searchLabel='Find a category'
        searchPlaceholder='Search by name or description…'
        selects={[
          {
            key: 'described',
            label: 'Description',
            value: table.filterValues.described ?? '',
            options: DESCRIBED_OPTIONS,
            onChange: (value) => table.setFilter('described', value),
          },
        ]}
        hasActiveFilters={table.hasActiveFilters}
        onClearFilters={table.clearFilters}
      />

      <DataTable
        caption='Gear categories available to providers'
        columns={columns}
        rows={table.rows}
        getRowKey={(category) => category.id}
        emptyIcon={Tag}
        emptyTitle={
          table.hasActiveFilters ? 'No matching categories' : 'No categories yet'
        }
        emptyDescription={
          table.hasActiveFilters
            ? 'Try a different search term or filter.'
            : 'Create your first gear category so providers can list equipment under it.'
        }
        emptyAction={
          !table.hasActiveFilters && (
            <Button
              onClick={openCreate}
              size='sm'
              leadingIcon={
                <PlusCircle className='h-3.5 w-3.5' aria-hidden='true' />
              }
            >
              New Category
            </Button>
          )
        }
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSort={table.toggleSort}
        footer={
          <Pagination
            page={table.page}
            totalPages={table.totalPages}
            total={table.filteredCount}
            pageSize={PAGE_SIZE}
            onPageChange={table.setPage}
            itemLabel='categories'
          />
        }
      />

      <Modal
        open={showForm}
        onClose={() => !saving && setShowForm(false)}
        title={editingId ? 'Edit Category' : 'New Category'}
        onSave={handleSave}
        saving={saving}
        saveLabel={editingId ? 'Update' : 'Create'}
        footerRight
      >
        <form
          className='flex flex-col gap-4'
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <FormField label='Name' error={errors.name} required>
            {(props) => (
              <input
                {...props}
                type='text'
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder='e.g. Cycling'
                maxLength={100}
              />
            )}
          </FormField>

          <FormField
            label='Description'
            error={errors.description}
            hint='Optional - shown to customers when browsing.'
          >
            {(props) => (
              <input
                {...props}
                type='text'
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder='Short description (optional)'
                maxLength={255}
              />
            )}
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
