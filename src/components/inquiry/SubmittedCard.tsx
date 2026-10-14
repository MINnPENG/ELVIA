import type { CreatedInquiry } from '@/lib/inquiries/schema';
import { LinkButton } from '../buttons/Buttons';

const TYPE_LABEL: Record<CreatedInquiry['inquiryType'], string> = {
  repair: '수리 문의',
  purchase: '구매 문의',
  product: '제품 사용 문의',
};

const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(new Date(iso))
    .replace(/\.\s/g, '.')
    .replace(/\.\s?(\d{2}:\d{2})$/, ' $1');

export default function SubmittedCard({ inquiry }: { inquiry: CreatedInquiry }) {
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
        <p className='text-[14px] leading-5.5 text-[#667085]'>접수 번호</p>
        <p className='text-[16px] leading-6.5 text-[#101828]'>{inquiry.inquiryNo}</p>
      </div>
      <div className='flex items-center justify-between'>
        <p className='text-[14px] leading-5.5 text-[#667085]'>조회 이메일</p>
        <p className='text-[16px] leading-6.5 text-[#101828]'>{inquiry.email}</p>
      </div>
      <div className='flex items-center justify-between'>
        <p className='text-[14px] leading-5.5 text-[#667085]'>문의 유형</p>
        <p className='text-[16px] leading-6.5 text-[#101828]'>{TYPE_LABEL[inquiry.inquiryType]}</p>
      </div>
      <div className='flex items-center justify-between'>
        <p className='text-[14px] leading-5.5 text-[#667085]'>접수 일시</p>
        <p className='text-[16px] leading-6.5 text-[#101828]'>
          {formatDateTime(inquiry.createdAt)}
        </p>
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
