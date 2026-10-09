import type { ProductView } from '@/lib/products/types';
import { formatPrice } from '@/lib/products/labels';
import AccessChip from './AccessChip';
import FeatureCard from './FeatureCard';
import { DownloadButton, LinkButton } from '../buttons/Buttons';

export default function DetailRightSection({ product }: { product: ProductView }) {
  const priceLabel = formatPrice(product);

  return (
    <div className='flex flex-col justify-center gap-19.25'>
      <div>
        <p className='mb-5 text-[14px] font-bold text-[#1F61C7]'>ELVIA SMART LOCK</p>
        <p className='mb-4 text-[48px] font-bold text-[#0F131A]'>{product.name}</p>
        <p className='mb-3 text-[22px] font-medium text-[#0F131A]'>{product.shortDescription}</p>
        <p className='mb-7 text-[17px] text-[#616B7A]'>{product.description}</p>
        {priceLabel && (
          <div className='flex items-baseline gap-1'>
            <p className='text-[36px] font-bold text-[#0F131A]'>{priceLabel}</p>
            {product.priceDisplayStatus === 'DISPLAY' && (
              <p className='text-[18px] text-[#808080]'>(VAT 포함)</p>
            )}
          </div>
        )}
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <p className='text-[16px] font-bold text-[#0F131A]'>출입 방식</p>
          <div>
            <AccessChip methods={product.accessMethods} />
          </div>
        </div>
        <div>
          <p className='text-[16px] font-bold text-[#0F131A]'>주요 기능</p>
          <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4'>
            {product.features.slice(0, 4).map((feature) => (
              <FeatureCard key={feature.code} feature={feature} />
            ))}
          </div>
        </div>
      </div>
      <div className='flex gap-4'>
        <LinkButton
          variant='brand'
          href='/inquiry'
          className='h-15 rounded-md px-15 py-4.25 text-[16px] font-bold'
        >
          제품 사용 문의하기
        </LinkButton>
        {product.manual && (
          <DownloadButton
            href={product.manual.url}
            fileName={product.manual.name}
            target='_blank'
            rel='noopener noreferrer'
            className='h-15 rounded-md px-15 py-4.25 text-[16px] font-bold'
          >
            사용설명서
          </DownloadButton>
        )}
      </div>
    </div>
  );
}
