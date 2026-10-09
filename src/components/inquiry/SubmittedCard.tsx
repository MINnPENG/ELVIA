import { LinkButton } from '../buttons/Buttons';

export default function SubmittedCard() {
  return (
    <div className='flex flex-col gap-7'>
      <p className='text-[14px] leading-5 font-bold text-[#071A33]'>접수 완료</p>
      <p className='text-[36px] leading-11.5 font-bold text-[#101828]'>
        담당자가 문의 내용을 확인하고 있습니다
      </p>
      <p className='text-[16px] leading-6.5 text-[#667085]'>
        답변이 등록되면 아래 이메일로 안내해 드립니다. 비밀번호는 다시 확인할 수 없으니 안전하게
        보관해 주세요.
      </p>

      <hr className='border-t border-[#EAECF0]' />

      <div className='flex items-center justify-between'>
        <p className='text-[14px] leading-5.5 text-[#667085]'>조회 이메일</p>
        <p className='text-[16px] leading-6.5 text-[#101828]'>ELVIA@example.com</p>
      </div>
      <div className='flex items-center justify-between'>
        <p className='text-[14px] leading-5.5 text-[#667085]'>문의 유형</p>
        <p className='text-[16px] leading-6.5 text-[#101828]'>제품 사용 문의</p>
      </div>
      <div className='flex items-center justify-between'>
        <p className='text-[14px] leading-5.5 text-[#667085]'>접수 일시</p>
        <p className='text-[16px] leading-6.5 text-[#101828]'>2026.10.10 02:49</p>
      </div>

      <div className='flex items-center justify-end gap-3'>
        <LinkButton
          href='/'
          variant='surface'
          className='h-12 w-35 rounded-lg px-5 py-3.5 text-[14px] leading-5 font-bold text-[#071A33]'
        >
          홈으로
        </LinkButton>
        <LinkButton
          href='/QnA'
          className='h-12 w-45 rounded-lg px-5 py-3.5 text-[14px] leading-5 font-bold'
        >
          문의 확인
        </LinkButton>
      </div>
    </div>
  );
}
