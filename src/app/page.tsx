import ProductCard from '@/components/product/ProductCard';
import { IconNText } from '@/components/ui/IconNText';
import { company, contact } from '@/data/content';
import { products } from '@/data/product';
import { Building2, ChevronRight, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className='w-full'>
        <video className='h-auto w-full' src='/banner_video.mp4' autoPlay loop muted playsInline />
      </div>

      <div className='flex flex-col'>
        <div className='flex items-center justify-between px-16 py-8 lg:py-4'>
          <h3 className='text-[19px] font-bold md:text-[22px] lg:text-[19px]'>주요 제품</h3>
          <div className='flex items-center gap-1 text-gray-400 hover:cursor-pointer'>
            <Link href='/products' className='text-[12px]'>
              전체보기
            </Link>
            <ChevronRight size={14} />
          </div>
        </div>
        <div className='flex flex-wrap justify-center gap-4 px-8'>
          {products
            .filter((product) => product.isHome)
            .map((product) => (
              <ProductCard
                id={product.id}
                key={product.id}
                image={product.images[0]}
                name={product.name}
                description={product.description}
                category={product.category}
              />
            ))}
        </div>
      </div>

      <hr className='mx-8 mt-6 border-gray-200' />

      <div className='flex gap-10 px-16 py-8 lg:py-4'>
        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <h3 className='text-[19px] font-bold md:text-[22px] lg:text-[19px]'>회사 소개</h3>
          <p className='text-[13px]'>{company.desciption}</p>
        </div>
        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <h3 className='text-[19px] font-bold md:text-[22px] lg:text-[19px]'>고객 지원</h3>
          <IconNText icon={Building2} text={contact.name} />
          <IconNText icon={MapPin} text={contact.address} />
          <IconNText icon={Phone} text={contact.tel} />
        </div>
      </div>
    </div>
  );
}
