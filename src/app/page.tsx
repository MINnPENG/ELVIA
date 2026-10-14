import ProductCard from '@/components/product/ProductCard';
import { IconNText } from '@/components/ui/IconNText';
import { company, contact } from '@/data/content';
import { formatPrice } from '@/lib/products/labels';
import { getPublicProducts } from '@/lib/products/queries';
import { Building2, ChevronRight, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const featured = await getPublicProducts({ featuredOnly: true });
  return (
    <div>
      <div className='w-full'>
        <video className='h-auto w-full' src='/banner_video.mp4' autoPlay loop muted playsInline />
      </div>

      <div className='flex flex-col gap-8 px-6 py-10'>
        <div className='flex items-center justify-between lg:py-4'>
          <h3 className='text-[19px] font-bold text-[#0F131A] md:text-[22px] lg:text-[32px]'>
            주요 제품
          </h3>
          <div className='flex items-center gap-1 text-[#0F131A] hover:cursor-pointer'>
            <Link href='/products' className='text-[16 px]'>
              전체보기
            </Link>
            <ChevronRight size={14} />
          </div>
        </div>
        <div className='mx-auto grid grid-cols-1 justify-center gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {featured.map((product) => (
            <ProductCard
              id={product.id}
              key={product.id}
              image={product.thumbnailUrl}
              name={product.name}
              priceLabel={formatPrice(product)}
              description={product.shortDescription}
            />
          ))}
        </div>
      </div>

      <hr className='mx-6 mt-6 border-[#EAECF0]' />

      <div className='flex gap-10 px-6 py-8'>
        <div className='flex min-w-0 flex-1 flex-col gap-3'>
          <h3 className='text-[19px] font-bold text-[#0F131A] md:text-[22px] lg:text-[32px]'>
            회사 소개
          </h3>
          <p className='text-[16px]'>{company.desciption}</p>
        </div>
      </div>
    </div>
  );
}
