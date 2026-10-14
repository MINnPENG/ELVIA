import { formatDateTime } from '@/lib/inquiries/format';
import { INQUIRY_TYPE_LABEL, InquiryListItem, InquiryStatus } from '@/lib/inquiries/types';
import StatusChip from './StatusChip';
import Link from 'next/link';

interface InquiryItemsProps {
  inquiry: InquiryListItem;
  isSelected: boolean;
  page: number;
  status?: InquiryStatus;
  keyword?: string;
}

export default function InquiryItem({
  inquiry,
  isSelected,
  page,
  status,
  keyword,
}: InquiryItemsProps) {
  const params = new URLSearchParams({ page: String(page) });
  if (!isSelected) params.set('selected', inquiry.id);
  if (status) params.set('status', status);
  if (keyword) params.set('keyword', keyword);

  return (
    <li className='border-b border-[#EAECF0]'>
      <Link
        href={`?${params}`}
        replace
        scroll={false}
        aria-current={isSelected ? 'true' : undefined}
        className={`flex flex-col items-center gap-2 p-6 transition-colors md:flex-row md:justify-between ${isSelected ? 'bg-[#F5F7FA]' : 'hover:bg-[#F5F7FA]'} `}
      >
        <div className='flex flex-col gap-1.5'>
          <p className='text-[20px] leading-7 font-bold text-[#101828]'>{inquiry.title}</p>
          <p className='text-[14px] leading-5.5 text-[#667085]'>
            {formatDateTime(inquiry.created_at)} · {INQUIRY_TYPE_LABEL[inquiry.inquiry_type]}
          </p>
        </div>
        <div>
          <StatusChip status={inquiry.status} />
        </div>
      </Link>
    </li>
  );
}
