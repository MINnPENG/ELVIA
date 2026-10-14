import CheckMyInquiryCard from '@/components/inquiry/CheckMyInquiryCard';
import InquiryList from '@/components/inquiry/InquiryList';
import InquiryPagination from '@/components/inquiry/InquiryPagination';
import { getInquiryList, parsePage, parseStatus } from '@/lib/inquiries/queries';

export default async function InquiryListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; selected?: string; status?: string; keyword?: string }>;
}) {
  const { page, selected, status, keyword } = await searchParams;

  const currentPage = parsePage(page);
  const currentStatus = parseStatus(status);
  const currentKeyword = keyword?.trim().slice(0, 50) || undefined;

  const { items, totalPages } = await getInquiryList({
    status: currentStatus,
    keyword: currentKeyword,
    page: currentPage,
  });

  const selectedId = items.some((q) => q.id === selected) ? selected! : null;

  return (
    <div className='flex gap-5'>
      <div className='flex min-w-0 flex-col'>
        <InquiryList
          inquiries={items}
          selectedId={selectedId}
          page={currentPage}
          status={currentStatus}
          keyword={currentKeyword}
        />
        <InquiryPagination page={currentPage} totalPages={totalPages} />
      </div>
      <CheckMyInquiryCard key={selectedId ?? 'none'} selectedId={selectedId} />
    </div>
  );
}
