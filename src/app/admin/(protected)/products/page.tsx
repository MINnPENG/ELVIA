// app/admin/products/page.tsx
import ProductFilterBar from '@/components/admin/ProductFilterBar';
import ProductList from '@/components/admin/ProductList';
import { LinkButton } from '@/components/buttons/Buttons';
import InquiryPagination from '@/components/inquiry/InquiryPagination';
import { parseProductFilters } from '@/lib/admin/productFilter';
import { ADMIN_PRODUCT_PAGE_SIZE, getAdminProducts } from '@/lib/admin/products';
import { Suspense } from 'react';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseProductFilters(await searchParams);
  const { products, total } = await getAdminProducts(filters);
  const isFiltered = Boolean(filters.category || filters.visibility || filters.search);
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PRODUCT_PAGE_SIZE));

  return (
    <div className='mx-auto flex w-full flex-col gap-8 px-4 pb-20'>
      <div className='flex flex-wrap items-center justify-between gap-4 border-b border-[#EAECF0] py-8'>
        <div className='flex flex-col gap-1.5'>
          <p className='text-[36px] leading-11.5 font-bold text-[#101828]'>제품 관리</p>
          <p className='mt-2 text-[14px] leading-5.5 text-[#667085]'>
            공개 상태와 제품 정보를 관리합니다.
          </p>
        </div>
        <LinkButton
          variant='surface'
          href='/admin/products/new'
          className='h-12 w-37.5 rounded-lg px-5 py-3.5 text-[14px] leading-5 font-bold'
        >
          제품 등록
        </LinkButton>
      </div>

      <Suspense>
        <ProductFilterBar />
      </Suspense>

      <ProductList products={products} isFiltered={isFiltered} total={total} />

      {totalPages > 1 && (
        <Suspense>
          <InquiryPagination page={filters.page} totalPages={totalPages} />
        </Suspense>
      )}
    </div>
  );
}
