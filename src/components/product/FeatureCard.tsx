import Image from 'next/image';

export default function FeatureCard() {
  return (
    <div className='flex flex-col gap-2 rounded-lg bg-[#F5F7FA] p-3.5'>
      <span className='h-9 w-9 rounded-full border border-[#DBE0E8] bg-[#FFFFFF] px-2 py-2'>
        <Image src='/DNT_logo.png' width={40} height={40} alt='아이콘' />
      </span>
      <p className='text-[14px] font-bold text-[#0F131A]'>기능 1</p>
      <p className='py-1 text-[12px] text-[#616B7A]'>기능 설명</p>
    </div>
  );
}
