import { getAllCategoriesAction } from '@/app/(public)/_actions/getAllCategories';
import { CategoriesContent } from './_components/CategoriesContent';
import type { Category } from '@/lib/types';

export default async function AdminCategoriesPage() {
  let categories: Category[] = [];
  let error: string | null = null;

  const result = await getAllCategoriesAction();
  if (result.success && result.data) {
    categories = result.data;
  } else {
    error = result.error ?? 'Failed to load categories.';
  }

  return (
    <div>
      <CategoriesContent initialCategories={categories} initialError={error} />
    </div>
  );
}
