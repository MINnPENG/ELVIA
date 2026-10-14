'use client';

import { CategoryConfig } from '@/lib/products/categories';
import { ProductCategory } from '@/lib/products/types';

interface CategoryTabsProps {
  categories: CategoryConfig[];
  selected: ProductCategory;
  onChange: (key: ProductCategory) => void;
}

export function CategoryTabs({ categories, selected, onChange }: CategoryTabsProps) {
  return (
    <div className='flex gap-3'>
      {categories.map(({ key, label }) => {
        const isActive = key === selected;

        return (
          <button
            key={key}
            type='button'
            role='tab'
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className={`h-12 w-35.5 rounded-3xl text-[16px] font-medium ${isActive ? 'bg-[#0E2447] text-white' : 'border border-[#DBE0E8] hover:bg-[#0E2447]/8'}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
