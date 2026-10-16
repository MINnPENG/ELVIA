import { AdminProduct } from '@/lib/admin/products';
import { formatPrice } from '@/lib/products/labels';
import { cn } from '@/utils/cn';
import { ActionButton, LinkButton } from '../buttons/Buttons';
import Image from 'next/image';

export const PRODUCT_GRID = 'grid grid-cols-[minmax(0,2.6fr)_1.2fr_0.8fr_0.9fr_1.8fr] items-center';

const MANAGE_BUTTON = 'h-12 w-23 rounded-lg text-[14px] leading-5 font-bold';

export default function ProductListItem({ product }: { product: AdminProduct }) {
  const price =
    formatPrice({
      price: product.price_amount,
      priceDisplayStatus: product.price_display_status,
    }) ?? '가격 미정';

  const isPublic = product.visibility === 'PUBLIC';

  return (
    <div role='row' className={cn(PRODUCT_GRID, 'border-b border-[#EAECF0] py-5 text-center')}>
      <div role='cell' className='flex min-w-0 items-center gap-5 px-4 text-left'>
        <div className='relative h-22 w-18 shrink-0 overflow-hidden rounded bg-[#F8FAFC]'>
          {product.thumbnail_url ? (
            <Image
              src={product.thumbnail_url}
              alt={`${product.model_name} 제품 이미지`}
              fill
              sizes='64px'
              className='object-contain p-2'
            />
          ) : (
            <span
              aria-hidden
              className='flex h-full items-center justify-center px-1 text-center text-[12px] leading-4.5 break-all text-[#071A33]'
            >
              {product.model_name}
            </span>
          )}
        </div>
        <div className='flex min-w-0 flex-col gap-1.5'>
          <p className='truncate text-[20px] leading-7 font-bold text-[#101828]'>
            {product.model_name}
          </p>
          <p className='truncate text-[14px] leading-5.5 text-[#667085]'>{product.category}</p>
        </div>
      </div>

      <div role='cell' className='text-[16px] leading-6.5 text-[#101828]'>
        {price}
      </div>

      <div role='cell' className='text-[16px] leading-6.5 text-[#101828]'>
        {product.sort_order}
      </div>

      <div role='cell' className='flex justify-center'>
        <span
          className={cn(
            'inline-flex h-7.5 min-w-23 items-center justify-center rounded-full px-3 py-1.5 text-[12px] leading-4.5 font-bold',
            isPublic
              ? 'bg-[#ECFDF3] font-bold text-[#039855]'
              : 'bg-[#F8FAFC] font-medium text-[#667085]'
          )}
        >
          {isPublic ? '공개' : '비공개'}
        </span>
      </div>

      <div role='cell' className='flex justify-center gap-2'>
        <LinkButton
          variant='surface'
          href={`/admin/products/${product.id}/edit`}
          className={MANAGE_BUTTON}
        >
          수정
        </LinkButton>
        <ActionButton
          variant='surface'
          border='red'
          className={cn(MANAGE_BUTTON, 'bg-[#FEF3F2]! text-[#D92D20] hover:bg-[#FEE4E2]!')}
        >
          삭제
        </ActionButton>
      </div>
    </div>
  );
}
