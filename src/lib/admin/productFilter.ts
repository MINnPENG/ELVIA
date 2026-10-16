import { CATEGORIES } from '@/lib/products/categories';
import type { ProductCategory } from '@/lib/products/types';

export const CATEGORY_FILTER_OPTIONS = [
  { label: '전체 분류', value: '' },
  ...CATEGORIES.map((c) => ({ label: c.label, value: c.key })),
];

export const VISIBILITY_FILTER_OPTIONS = [
  { label: '전체', value: '' },
  { label: '공개', value: 'PUBLIC' },
  { label: '비공개', value: 'PRIVATE' },
] as const;

export type AdminProductFilters = {
  category?: ProductCategory;
  visibility?: 'PUBLIC' | 'PRIVATE';
  search?: string;
  page: number;
};

type RawParams = Record<string, string | string[] | undefined>;
const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function parseProductFilters(params: RawParams): AdminProductFilters {
  const category = pick(params.category);
  const visibility = pick(params.visibility);
  const search = pick(params.search)?.trim();
  const page = Number(pick(params.page));

  return {
    category: CATEGORIES.some((c) => c.key === category)
      ? (category as ProductCategory)
      : undefined,
    visibility: visibility === 'PUBLIC' || visibility === 'PRIVATE' ? visibility : undefined,
    search: search || undefined,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}
