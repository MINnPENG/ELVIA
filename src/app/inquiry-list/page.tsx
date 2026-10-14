import CheckMyInquiryCard from '@/components/inquiry/CheckMyInquiryCard';
import InquiryList from '@/components/inquiry/InquiryList';
import { getInquiries, InquiryStatus } from '@/mock/inquiry';

const STATUSES: InquiryStatus[] = ['WAITING', 'ANSWERED'];

export default async function InquiryListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; selected?: string; status?: string; keyword?: string }>;
}) {
  const { page, selected, status, keyword } = await searchParams;

  const currentPage = Number(page) || 1;
  const currentStatus = STATUSES.includes(status as InquiryStatus)
    ? (status as InquiryStatus)
    : undefined;
  const currentKeyword = keyword?.trim() || undefined;

  const { items } = getInquiries({
    status: currentStatus,
    keyword: currentKeyword,
    page: currentPage,
  });

  const selectedId = items.some((q) => q.id === selected) ? selected! : null;

  return (
    <div className='flex gap-5'>
      <InquiryList
        inquiries={items}
        selectedId={selectedId}
        page={currentPage}
        status={currentStatus}
        keyword={currentKeyword}
      />
      <CheckMyInquiryCard key={selectedId ?? 'none'} selectedId={selectedId} />
    </div>
  );
}
