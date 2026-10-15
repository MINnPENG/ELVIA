import { InquiryListItem, InquiryStatus } from '@/lib/inquiries/types';
import InquiryItem from './InquiryItem';
import { LinkButton } from '../buttons/Buttons';
import InquiryListFilter from './InquiryListFilter';

interface InquiryListProps {
  inquiries: InquiryListItem[];
  selectedId: string | null;
  page: number;
  status?: InquiryStatus;
  keyword?: string;
}

export default function InquiryList({
  inquiries,
  selectedId,
  page,
  status,
  keyword,
}: InquiryListProps) {
  const isFiltered = Boolean(status || keyword);

  return (
    <div className='bg-white py-10'>
      <div className='flex flex-col'>
        <div className='flex h-16 justify-between'>
          <p className='text-[28px] leading-9.5 font-bold text-[#101828]'>문의 및 답변</p>
          <LinkButton
            variant='primary'
            href='/inquiry-list/create-inquiry'
            className='h-12 w-40 rounded-lg px-5 py-3.5 text-[14px] leading-5 font-bold'
          >
            새 문의 작성
          </LinkButton>
        </div>
        <InquiryListFilter
          key={`${status ?? ''}|${keyword ?? ''}`}
          status={status}
          keyword={keyword}
        />
      </div>

      {inquiries.length === 0 ? (
        <div className='p-20 text-center'>
          <p className='text-[28px] leading-9.5 font-bold text-[#101828]'>
            {isFiltered ? '검색 결과가 없습니다.' : '등록된 문의가 없습니다.'}
          </p>
        </div>
      ) : (
        <ul>
          {inquiries.map((inquiry) => (
            <InquiryItem
              key={inquiry.id}
              inquiry={inquiry}
              isSelected={inquiry.id === selectedId}
              page={page}
              status={status}
              keyword={keyword}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
