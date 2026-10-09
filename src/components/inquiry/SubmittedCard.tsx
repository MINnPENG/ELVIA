import Image from 'next/image';
import { LinkButton } from '../buttons/Buttons';

export default function SubmittedCard() {
  return (
    <div className='flex flex-col gap-7 rounded-2xl border border-[#EAECF0] p-12 shadow-[0_12px_32px_-8px_rgba(10,26,51,0.12)]'>
      <div className='flex h-18 w-18 items-center justify-center rounded-full bg-[#ECFDF3]'>
        <Image src='/Vector.png' alt='check' width={28} height={22} />
      </div>
      <p className='text-[28px] leading-9.5 font-bold text-[#101828]'>접수가 완료되었어요</p>
      <p className='text-[16px] leading-6.5 text-[#667085]'>
        등록한 이메일을 기억해 주세요. 문의 시 설정한 비밀번호와 함께 답변을 확인할 수 있습니다.
      </p>
      <div className='flex flex-col gap-2 rounded-xl bg-[#EAF2FF] p-6'>
        <p className='text-[12px] leading-4.5 text-[#667085]'>조회 이메일</p>
        <p className='mb-5 text-[28px] leading-9.5 font-bold text-[#0B2447]'>ELVIA@example.com</p>
      </div>
      <div className='flex gap-4 bg-[#F8FAFC] p-4 text-[14px] leading-5.5'>
        <div className='flex h-19 w-61.25 items-center justify-center rounded-lg bg-[#ECFDF3] p-2 text-[#039855]'>
          <p>1. 접수 완료</p>
        </div>
        <div className='flex h-19 w-61.25 items-center justify-center rounded-lg bg-white p-2 text-[#667085]'>
          <p>2. 담당자 확인</p>
        </div>
        <div className='flex h-19 w-61.25 items-center justify-center rounded-lg bg-white p-2 text-[#667085]'>
          <p>3. 답변 등록</p>
        </div>
      </div>
      <div className='flex items-center justify-end gap-3'>
        <LinkButton
          href='/'
          variant='surface'
          className='h-12 w-40 rounded-lg px-5 py-3.5 text-[14px] leading-5 font-bold text-[#0B2447]'
        >
          홈으로
        </LinkButton>
        <LinkButton
          href='/QnA'
          className='h-12 w-50 rounded-lg px-5 py-3.5 text-[14px] leading-5 font-bold'
        >
          내 문의 확인
        </LinkButton>
      </div>
    </div>
  );
}
