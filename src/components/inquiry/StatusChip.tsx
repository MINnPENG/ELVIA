import { INQUIRY_STATUS_LABEL, InquiryStatus } from '@/mock/inquiry';

const STATUS_STYLE: Record<InquiryStatus, string> = {
  ANSWERED: 'text-[#087A55] bg-[#ECFDF3]',
  WAITING: 'text-[#B54708] bg-[#FFF4E5]',
};

export default function StatusChip({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] leading-4.5 font-medium ${STATUS_STYLE[status]}`}
    >
      {INQUIRY_STATUS_LABEL[status]}
    </span>
  );
}
