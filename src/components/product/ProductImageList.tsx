import Image from 'next/image';

export type ImageType = {
  id: string;
  url: string;
};

interface ProductImageListProps {
  images: ImageType[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function ProductImageList({ images, activeIndex, onSelect }: ProductImageListProps) {
  return (
    <ul className='hidden w-12 shrink-0 flex-col gap-3 md:flex'>
      {images.map((image, index) => {
        const isActive = index === activeIndex;

        return (
          <li key={image.id}>
            <button
              type='button'
              onClick={() => onSelect(index)}
              aria-label={`${index + 1}번째 이미지 보기`}
              aria-current={isActive}
              className={`relative block aspect-4/5 w-full overflow-hidden rounded-[10px] border-2 bg-[#F6F8FA] transition-colors ${
                isActive ? 'border-[#1F61C7]' : 'border-transparent hover:border-[#1F61C7]'
              }`}
            >
              <Image
                src={image.url}
                alt={`${index + 1}번째 이미지`}
                fill
                sizes='75px'
                className='object-contain p-2'
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
