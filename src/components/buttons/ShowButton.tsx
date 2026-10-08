'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ShowButtonProps {
  id: string;
  variant?: 'home' | 'detail';
}

export default function ShowButton({ id, variant }: ShowButtonProps) {
  return (
    <div>
      {variant === 'home' ? (
        <Link
          href={`/products/${id}`}
          className='flex items-center gap-1 text-[14px] text-[#1F61C7] hover:cursor-pointer hover:text-[#132B52]'
        >
          자세히
          <ArrowRight className='h-3 w-3 text-[#1F61C7]' />
        </Link>
      ) : (
        <Link
          href={`/products/${id}`}
          className='text-[15px] text-[#1F61C7] hover:cursor-pointer hover:text-[#132B52]'
        >
          자세히 보기
        </Link>
      )}
    </div>
  );
}
