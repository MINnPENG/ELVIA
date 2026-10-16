import { AdminProduct } from '@/lib/admin/products';
import ProductListItem, { PRODUCT_GRID } from './ProductListItem';
import { cn } from '@/utils/cn';

const COLUMNS = ['제품', '소비자가', '순서', '상태', '관리'];

export default function ProductList({
  products,
  isFiltered,
  total,
}: {
  products: AdminProduct[];
  isFiltered: boolean;
  total: number;
}) {
  return (
    <div>
      <div className='mb-6 flex flex-wrap items-end justify-between gap-2'>
        <p className='text-[18px] leading-7 font-bold text-[#101828]'>
          {isFiltered ? '검색 결과' : '전체 제품'} {total}개
        </p>
        <p className='text-[12px] leading-4.5 text-[#667085]'>
          정렬 순서가 낮을수록 먼저 노출됩니다.
        </p>
      </div>

      {products.length === 0 ? (
        <div className='flex h-60 items-center justify-center rounded-lg border border-dashed border-[#EAECF0] text-[14px] text-[#667085]'>
          {isFiltered ? '조건에 맞는 제품이 없습니다.' : '등록된 제품이 없습니다.'}
        </div>
      ) : (
        <div>
          <div role='table' aria-labelledby='product-list-title' className='min-w-220'>
            <div
              role='row'
              className={cn(
                PRODUCT_GRID,
                'h-13 bg-[#F8FAFC] text-center text-[12px] leading-4.5 text-[#667085]'
              )}
            >
              {COLUMNS.map((column) => (
                <div key={column} role='columnheader'>
                  {column}
                </div>
              ))}
            </div>

            {products.map((p) => (
              <ProductListItem key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
