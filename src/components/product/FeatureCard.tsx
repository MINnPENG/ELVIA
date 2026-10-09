import { ProductFeature } from '@/mock/product';
import Image from 'next/image';

export default function FeatureCard({ feature }: { feature: ProductFeature }) {
  return (
    <div className='flex h-40 flex-col gap-2 rounded-lg bg-[#F5F7FA] p-3.5 md:max-w-40.5'>
      <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#DBE0E8] bg-[#FFFFFF]'>
        <Image src='/DNT_logo.png' width={30} height={30} alt='아이콘' />
      </span>
      <p className='text-[14px] font-bold text-[#0F131A]'>{feature.name}</p>
      <p className='py-1 text-[12px] text-[#616B7A]'>{feature.description}</p>
    </div>
  );
}
