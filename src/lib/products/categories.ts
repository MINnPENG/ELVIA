import { ProductCategory } from './types';

export interface CategoryConfig {
  key: ProductCategory;
  label: string;
  title: string;
  description: string;
  slug: string;
  emptyDescription: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    key: 'DOOR_LOCK',
    label: '도어락',
    title: '스마트 도어락',
    description: '사용 환경과 필요한 기능을 비교하고, 제품 상세 정보와 소비자가격을 확인해보세요.',
    slug: 'door-lock',
    emptyDescription: '곧 새로운 도어락 제품을 만나보실 수 있습니다.',
  },
  {
    key: 'ACCESSORY',
    label: '악세사리',
    title: '악세사리',
    description: '사용 환경과 필요한 기능을 비교하고, 제품 상세 정보와 소비자가격을 확인해보세요.',
    slug: 'accessory',
    emptyDescription: '악세사리를 준비 중입니다.',
  },
];

export const DEFAULT_CATEGORY: ProductCategory = 'DOOR_LOCK';

export function getCategoryConfig(key: ProductCategory): CategoryConfig {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
}

export function categoryFromSlug(slug?: string | null): ProductCategory {
  return CATEGORIES.find((c) => c.slug === slug)?.key ?? DEFAULT_CATEGORY;
}
