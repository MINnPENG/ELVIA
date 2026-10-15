import Image from 'next/image';
import { Check } from 'lucide-react';
import type { FeatureView } from '@/lib/products/types';

export default function FeatureCard({ feature }: { feature: FeatureView }) {
  return (
    <div className='flex h-40 flex-col gap-2 rounded-lg bg-[#F5F7FA] p-3.5'>
      <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#DBE0E8] bg-[#FFFFFF]'>
        {feature.icon ? (
          // SVG 는 next/image 가 최적화하지 않으므로 그대로 불러온다.
          <Image src={feature.icon} width={30} height={30} alt='' unoptimized />
        ) : (
          <Check size={24} strokeWidth={1.75} color='#0F131A' aria-hidden />
        )}
      </span>
      <p className='text-[14px] font-bold text-[#0F131A]'>{feature.name}</p>
      <p className='py-1 text-[12px] text-[#616B7A]'>{feature.description}</p>
    </div>
  );
}
