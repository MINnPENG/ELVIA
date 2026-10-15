import { InquiryDetail } from '@/lib/inquiries/types';
import { ReactNode } from 'react';
import { INQUIRY_TYPE_LABEL } from '../../lib/inquiries/types';
import { formatDateTime } from '@/lib/inquiries/format';
import StatusChip from './StatusChip';
import AttachmentList from './AttachmentList';

export type InquiryDetailViewProps = {
  detail: InquiryDetail;
  author?: { name: string; email: string };
  children: ReactNode;
  className?: string;
};

export default function InquiryDetailView({
  detail,
  author,
  children,
  className,
}: InquiryDetailViewProps) {
  const meta = [
    ['문의 번호', detail.inquiryNo],
    ['문의 구분', INQUIRY_TYPE_LABEL[detail.inquiryType]],
    ['작성자', `${author?.name} · ${author?.email}`],
    ['작성일', formatDateTime(detail.createdAt)],
  ].filter(Boolean) as [string, string][];

  return (
    <div className={['flex flex-col gap-6 p-6', className].filter(Boolean).join(' ')}>
      <div className='flex items-center justify-between'>
        <p className='text-[28px] leading-9.5 font-bold text-[#101828]'>문의 상세</p>
        <StatusChip status={detail.status} />
      </div>

      <hr className='border-[#EAECF0]' />

      <div className='grid grid-cols-[144px_1fr] gap-y-4.5'>
        {meta.map(([label, value]) => (
          <div key={label} className='contents'>
            <div className='text-[14px] leading-5.5 text-[#667085]'>{label}</div>
            <div className='text-[14px] leading-5.5 text-[#101828]'>{value}</div>
          </div>
        ))}
      </div>

      <hr className='border-[#EAECF0]' />

      <p className='text-[28px] leading-9.5 font-bold text-[#101828]'>{detail.title}</p>
      <p className='wrap-break-words text-[16px] leading-6.5 whitespace-pre-wrap text-[#101828]'>
        {detail.content}
      </p>

      <AttachmentList files={detail.attachments} />

      <div>{children}</div>
    </div>
  );
}
