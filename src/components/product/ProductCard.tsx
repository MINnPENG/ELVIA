'use client';

import Image from 'next/image';
import ShowButton from '../buttons/ShowButton';
import AccessChip from './AccessChip';
import { accessMethods } from '@/mock/product';
interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  variant?: 'home' | 'detail';
  category: 'doorlock' | 'accessory';
}

export default function ProductCard({
  id,
  image,
  name,
  description,
  price,
  variant = 'home',
  category,
}: ProductCardProps) {
  return (
    <div>
      {variant === 'home' ? (
        <div className='flex flex-col justify-center gap-3 rounded-[10px] border border-gray-300 px-4.75 py-5 lg:max-w-82.5'>
          <div className='flex justify-center rounded-lg bg-[#F5F7FA]'>
            <Image src={image} alt='product' width={150} height={314} className='self-center' />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-[22px] font-bold text-[#0F131A]'>{name}</p>
            <div className='flex h-11 items-center'>
              <p className='text-[15px] text-[#616B7A]'>{description}</p>
            </div>
            <div className='mb-3 flex items-center justify-between py-2.25'>
              <p className='text-[16px] font-bold text-[#0F131A]'>{price.toLocaleString()}원</p>
              <ShowButton id={id} variant={variant} category={category} />
            </div>
          </div>
        </div>
      ) : (
        <div className='flex h-130 max-w-md flex-col gap-3.5 rounded-md border border-gray-300 bg-[#FFFFFF] px-5.75 pt-6'>
          <div className='flex w-full justify-center rounded-lg bg-[#F6F8FA]'>
            <Image
              src={image}
              alt='product'
              width={250}
              height={250}
              className='aspect-square self-center object-cover lg:w-60'
            />
          </div>
          <div className='flex flex-col gap-3.5'>
            <div className='flex flex-col gap-1'>
              <p className='text-[24px] text-[#0F131A]'>{name}</p>
              <p className='text-[16px] text-[#616B7A]'>{description}</p>
            </div>
            <div className='flex h-12 items-center'>
              <p className='text-[28px] font-bold'>{price.toLocaleString()}원</p>
            </div>
            <div className='flex items-center justify-between'>
              <AccessChip methods={accessMethods} variant='card' />
              <ShowButton id={id} category={category} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
