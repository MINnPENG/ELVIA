'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import type { ProductCategory, ProductView } from '@/lib/products/types';
import { formatPrice } from '@/lib/products/labels';
import { Pagination } from '@/public/Pagination';
import { CATEGORIES, getCategoryConfig } from '@/lib/products/categories';
import { CategoryTabs } from './CategoryTabs';

interface CatalogProps {
  productsByCategory: Record<ProductCategory, ProductView[]>;
  initialCategory: ProductCategory;
  perPage?: number;
}

export function ProductCatalog({ productsByCategory, initialCategory, perPage = 8 }: CatalogProps) {
  const [category, setCategory] = useState<ProductCategory>(initialCategory);
  const [page, setPage] = useState(1);

  const config = getCategoryConfig(category);
  const products = productsByCategory[category] ?? [];
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const start = (page - 1) * perPage;
  const visible = products.slice(start, start + perPage);

  const handleCategoryChange = (next: ProductCategory) => {
    if (next === category) return;

    setCategory(next);
    setPage(1);

    const url = new URL(window.location.href);
    url.searchParams.set('category', getCategoryConfig(next).slug);
    window.history.replaceState(null, '', url);
  };

  return (
    <div className='min-h-screen bg-[#FDFEFF] px-6 py-8'>
      <div className='flex max-w-7xl flex-col gap-4'>
        <p aria-label='breadcrumb' className='text-[14px] text-[#616B7A]'>
          홈 <span className='mx-1'>|</span> 제품소개 <span className='mx-1'>|</span>
          <span className='text-[14px] text-[#616B7A]'> {config.label}</span>
        </p>
        <h1 className='text-[42px] font-bold text-[#0F131A]'>{config.title}</h1>
        <p className='text-[18px] text-[#616B7A]'>{config.description}</p>
      </div>

      <div className='flex items-center justify-between py-8'>
        <CategoryTabs categories={CATEGORIES} selected={category} onChange={handleCategoryChange} />
        <p className='text-[14px] font-medium text-[#616B7A]'>총 {products.length}개 제품</p>
      </div>

      {visible.length > 0 ? (
        <div role='tabpanel' className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.thumbnailUrl}
              name={product.name}
              description={product.shortDescription}
              priceLabel={formatPrice(product)}
              accessMethods={product.accessMethods}
              variant='detail'
            />
          ))}
        </div>
      ) : (
        <div role='tabpanel' className='flex items-center justify-center p-20'>
          <div>
            <p className='mt-2 text-[20px] text-[#616B7A]'>{config.emptyDescription}</p>
          </div>
        </div>
      )}

      <main className='mb-2 flex-1'>
        <div className='mx-auto max-w-7xl px-6 py-8'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'></div>

          {totalPages > 1 && (
            <div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
