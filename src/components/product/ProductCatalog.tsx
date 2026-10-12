'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import type { ProductView } from '@/lib/products/types';
import { formatPrice } from '@/lib/products/labels';
import { Pagination } from '@/public/Pagination';

interface CatalogProps {
  categoryLabel: string;
  products: ProductView[];
  perPage?: number;
}

export function ProductCatalog({ categoryLabel, products, perPage = 8 }: CatalogProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const start = (page - 1) * perPage;
  const visible = products.slice(start, start + perPage);

  return (
    <div className='flex min-h-screen flex-col bg-slate-50'>
      <div className='border-b border-slate-100 bg-white'>
        <div className='mx-auto max-w-7xl px-6 py-8'>
          <p className='mb-2 text-xs text-slate-400'>
            홈 <span className='mx-1'>|</span> 제품소개 <span className='mx-1'>|</span>
            <span className='font-semibold text-slate-700'> {categoryLabel}</span>
          </p>
          <h1 className='text-2xl font-bold text-[#1b2340]'>{categoryLabel}</h1>
        </div>
      </div>

      <main className='mb-2 flex-1'>
        <div className='mx-auto max-w-7xl px-6 py-8'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
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

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </main>
    </div>
  );
}
