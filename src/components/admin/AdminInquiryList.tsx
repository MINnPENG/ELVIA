import { buildInquiryHref } from '@/lib/inquiries/href';
import { InquiryListItem, InquiryStatus, InquiryType } from '@/lib/inquiries/types';
import Link from 'next/link';
import StatusChip from '../inquiry/StatusChip';
import { formatDateTime } from '@/lib/inquiries/format';
import { cn } from '@/utils/cn';
import InquiryPagination from '../inquiry/InquiryPagination';

const BASE_PATH = '/admin/inquiries';

interface AdminInquiryListProps {
  inquiries: InquiryListItem[];
  total: number;
  page: number;
  totalPages: number;
  selectedId?: string;
  status?: InquiryStatus;
  keyword?: string;
  type?: InquiryType;
}

export default function AdminInquiryList({
  inquiries,
  total,
  page,
  totalPages,
  selectedId,
  status,
  keyword,
  type,
}: AdminInquiryListProps) {
  const isFiltered = Boolean(status || type || keyword);

  return (
    <div>
      <div className='flex items-center justify-between border border-[#EAECF0] bg-[#F8FAFC] px-5 py-4'>
        <p className='text-[14px] leading-5 font-bold text-[#101828]'>
          {isFiltered ? '검색 결과' : '전체 문의'} {total.toLocaleString()}건
        </p>
        <span className='text-[12px] leading-4.5 text-[#667085]'>최신순</span>
      </div>

      {inquiries.length === 0 ? (
        <div className='flex items-center justify-center p-20'>
          <p>{isFiltered ? '검색 결과가 없습니다.' : '등록된 문의가 없습니다.'}</p>
        </div>
      ) : (
        <ul className='flex-1'>
          {inquiries.map((item) => {
            const isSelected = item.id === selectedId;
            const href = buildInquiryHref(BASE_PATH, {
              page,
              status,
              keyword,
              type,
              selected: isSelected ? null : item.id,
            });

            return (
              <li key={item.id}>
                <Link
                  href={href}
                  replace
                  scroll={false}
                  aria-current={isSelected ? 'true' : undefined}
                  className={cn(
                    'flex flex-col gap-2 px-5 py-4',
                    isSelected ? 'bg-[#EAF2FF]' : 'hover:bg-[#EAF2FF]'
                  )}
                >
                  <div>
                    <StatusChip status={item.status} />
                  </div>
                  <p className='text-[20px] leading-7 font-bold text-[#101828]'>{item.title}</p>
                  <p className='text-[12px] leading-4.5 text-[#667085]'>
                    {formatDateTime(item.created_at)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <div>
          <InquiryPagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
