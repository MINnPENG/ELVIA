interface ImageDotsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function ImageDots({ count, activeIndex, onSelect }: ImageDotsProps) {
  return (
    <div className='mt-4 flex justify-center gap-1 md:hidden'>
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type='button'
            onClick={() => onSelect(index)}
            aria-label={`${index + 1}번째 이미지 보기`}
            aria-current={isActive}
            className='p-1'
          >
            <span
              className={`block h-2.5 w-2.5 rounded-full transition-colors ${
                isActive ? 'bg-[#616B7A]' : 'bg-[#D9DDE3]'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
