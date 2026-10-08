import Link from 'next/link';

export default function BannerButton() {
  return (
    <Link
      href='/products'
      className='flex h-10 w-25 items-center justify-center rounded-sm bg-[#4E7CD4] text-[12px] font-bold text-white hover:cursor-pointer hover:bg-[#3a5bb0] md:h-11 md:w-31 md:text-[14px] lg:h-9.5 lg:w-27 lg:text-[12px]'
    >
      제품 보러가기
    </Link>
  );
}
