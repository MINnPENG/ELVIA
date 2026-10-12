'use client';

import { useEffect, useState } from 'react';
import ProductImageList, { ImageType } from './ProductImageList';
import Image from 'next/image';
import ColorChipGroup from './ColorChipGroup';
import ImageDots from './ImageDots';
import { ImageView, ProductView } from '@/lib/products/types';

const MAX_IMAGES = 5;
const AUTO_SLIDE_MS = 7000;

function getImagesForColor(images: ImageView[], colorId: string | null): ImageType[] {
  const matched = images.flatMap((img) => {
    const variant =
      img.variants.find((v) => v.colorId === colorId) ??
      img.variants.find((v) => v.colorId === null);
    return variant ? [{ id: img.id, url: variant.url }] : [];
  });

  if (matched.length > 0) return matched;

  return images.flatMap((img) =>
    img.variants[0] ? [{ id: img.id, url: img.variants[0].url }] : []
  );
}

type ImageSectionProps = {
  product: Pick<ProductView, 'name' | 'images' | 'colors'>;
};

export default function ImageSection({ product }: ImageSectionProps) {
  const { name, images, colors } = product;

  const [colorId, setColorId] = useState<string | null>(
    (colors.find((c) => c.isDefault) ?? colors[0])?.id ?? null
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const currentImages = getImagesForColor(images, colorId).slice(0, MAX_IMAGES);

  const safeIndex = Math.min(activeIndex, Math.max(currentImages.length - 1, 0));
  const mainImage = currentImages[safeIndex];

  useEffect(() => {
    if (currentImages.length <= 1) return;

    const timer = setTimeout(() => {
      setActiveIndex((safeIndex + 1) % currentImages.length);
    }, AUTO_SLIDE_MS);

    return () => clearTimeout(timer);
  }, [safeIndex, colorId, currentImages.length]);

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
              key={mainImage.url}
              src={mainImage.url}
              alt={`${name} 이미지 ${safeIndex + 1}`}
              fill
              priority
              sizes='(max-width: 768px) 80vw, 540px'
              className='object-contain p-10'
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
