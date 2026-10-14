'use client';

import Image from 'next/image';
import ShowButton from '../buttons/ShowButton';
import AccessChip from './AccessChip';
import type { AccessMethodView } from '@/lib/products/types';

interface ProductCardProps {
  id: string;
  image: string | null;
  name: string;
  description: string;
  priceLabel: string | null;
  accessMethods?: AccessMethodView[];
  variant?: 'home' | 'detail';
}

export default function ProductCard({
  id,
  image,
  name,
  description,
  priceLabel,
  accessMethods = [],
  variant = 'home',
}: ProductCardProps) {
  return (
    <div>
      {variant === 'home' ? (
        <div className='flex flex-col justify-center gap-3 rounded-[10px] border border-gray-300 px-4.75 py-5 lg:max-w-82.5'>
          <div className='flex h-65 items-center justify-center rounded-lg bg-[#F5F7FA] p-5'>
            {image && (
              <Image
                src={image}
                alt={name}
                width={150}
                height={314}
                className='h-full w-auto object-contain'
              />
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-[22px] font-bold text-[#0F131A]'>{name}</p>
            <div className='flex h-11 items-center'>
              <p className='text-[15px] text-[#616B7A]'>{description}</p>
            </div>
            <div className='mb-3 flex items-center justify-between py-2.25'>
              <p className='text-[16px] font-bold text-[#0F131A]'>{priceLabel}</p>
              <ShowButton id={id} variant={variant} />
            </div>
          </div>
        </div>
      ) : (
        <div className='flex h-130 max-w-md flex-col gap-3.5 rounded-md border border-gray-300 bg-[#FFFFFF] px-5.75 pt-6'>
          <div className='flex h-60 w-full items-center justify-center rounded-lg bg-[#F6F8FA]'>
            {image && (
              <Image
                src={image}
                alt={name}
                width={120}
                height={220}
                className='h-full w-auto object-contain py-3'
              />
            )}
          </div>
          <div className='flex flex-col gap-3.5'>
            <div className='flex flex-col gap-1'>
              <p className='text-[24px] text-[#0F131A]'>{name}</p>
              <p className='text-[16px] text-[#616B7A]'>{description}</p>
            </div>
            <div className='flex h-12 items-center'>
              <p className='text-[28px] font-bold'>{priceLabel}</p>
            </div>
            <div className='flex items-center justify-between'>
              <AccessChip methods={accessMethods} variant='card' />
              <ShowButton id={id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
