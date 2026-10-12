'use client';

import { useState } from 'react';
import ProductImageList, { ImageType } from './ProductImageList';
import Image from 'next/image';
import ColorChipGroup, { ColorOption } from './ColorChipGroup';
import ImageDots from './ImageDots';

const MAX_IMAGES = 5;

type GalleryProduct = {
  name: string;
  images: ImageType[];
  colors: ColorOption[];
  primaryImage: ImageType | null;
};

export default function ImageSection({ product }: { product: GalleryProduct }) {
  const { name, images, colors, primaryImage } = product;

  const [colorId, setColorId] = useState<string | null>(
    primaryImage?.color_id ?? colors[0]?.id ?? null
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const matched = images.filter((i) => i.color_id === colorId || i.color_id === null);
  const currentImages = (matched.length > 0 ? matched : images).slice(0, MAX_IMAGES);

  const safeIndex = Math.min(activeIndex, Math.max(currentImages.length - 1, 0));
  const mainImage = currentImages[safeIndex];

  const handleColorChange = (id: string) => {
    if (id === colorId) return;
    setColorId(id);
    setActiveIndex(0);
  };

  return (
    <section aria-label={`${name} 이미지`}>
      <div className='flex items-center gap-5'>
        {currentImages.length > 1 && (
          <ProductImageList
            images={currentImages}
            activeIndex={safeIndex}
            onSelect={setActiveIndex}
          />
        )}

        <div className='relative aspect-6/7 flex-1 overflow-hidden rounded-2xl bg-[#F6F8FA]'>
          {mainImage ? (
            <Image
              key={mainImage.id}
              src={mainImage.url}
              alt={`${name} 이미지 ${safeIndex + 1}`}
              fill
              priority
              sizes='(max-width: 768px) 80vw, 540px'
              className='object-contain p-3'
            />
          ) : (
            <div className='flex h-full items-center justify-center text-sm text-gray-400'>
              이미지 준비 중입니다
            </div>
          )}
        </div>
      </div>

      {currentImages.length > 1 && (
        <ImageDots count={currentImages.length} activeIndex={safeIndex} onSelect={setActiveIndex} />
      )}

      {colors.length > 0 && (
        <div className='mt-6'>
          <ColorChipGroup colors={colors} selectedId={colorId} onChange={handleColorChange} />
        </div>
      )}
    </section>
  );
}
