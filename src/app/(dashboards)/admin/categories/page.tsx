import { getAllCategoriesAction } from '@/app/(public)/_actions/getAllCategories';
import { CategoriesContent } from './_components/CategoriesContent';
import type { Category } from '@/lib/types';

export default async function AdminCategoriesPage() {
  let categories: Category[] = [];

  const result = await getAllCategoriesAction();
  if (result.success && result.data) {
    categories = result.data;
  }

  return (
    <div>
      <CategoriesContent initialCategories={categories} />
    </div>
  );
}
