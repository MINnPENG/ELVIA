'use client';

import Image from 'next/image';
import ShowButton from '../ui/ShowButton';

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  description: string;
  price?: number;
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
        <div className='flex h-102 w-100 flex-col gap-5 rounded-md border border-gray-300 px-5.25 py-6.25 lg:h-80 lg:w-75 lg:gap-2 lg:py-4'>
          <Image
            src={image}
            alt='product'
            width={200}
            height={200}
            className='aspect-square h-auto self-center object-cover lg:w-40'
          />
          <div className='flex flex-col gap-2'>
            <p className='text-[18px] font-bold lg:text-[16px]'>{name}</p>
            <p className='text-[15px] lg:text-[14px]'>{description}</p>
            <div className='flex h-6 w-27.5 justify-end self-end'>
              <ShowButton variant={variant} id={id} category={category} />
            </div>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-5 rounded-md border border-gray-300 px-5 py-10 md:gap-1 lg:w-120 lg:flex-row'>
          <Image
            src={image}
            alt='product'
            width={250}
            height={250}
            className='aspect-square self-center object-cover lg:w-60'
          />
          <div className='flex flex-col gap-3'>
            <p className='text-[18px] font-bold'>{name}</p>
            <p className='text-[13px]'>{description}</p>
            {price != undefined && (
              <p className='text-[15px] font-bold'>{price.toLocaleString()}원</p>
            )}
            <div className='flex h-6 w-35 justify-end self-end'>
              <ShowButton variant={variant} id={id} category={category} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
