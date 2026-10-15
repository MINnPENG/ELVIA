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
    <div>
      <div className='flex w-full flex-col gap-4 bg-white px-6 py-14.5'>
        <p className='text-[14px] leading-5 font-bold text-[#071A33]'>고객 문의</p>
        <p className='text-[36px] leading-11.5 font-bold text-[#101828]'>
          문의와 답변을 확인하세요
        </p>
        <p className='text-[16px] leading-6.25 text-[#667085]'>
          문의 작성 시 사용한 이메일과 비밀번호로 본인이 작성한 문의를 확인할 수 있습니다
        </p>
      </div>
      <div className='flex flex-col-reverse gap-5 bg-[#F8FAFC] px-6 lg:flex-row'>
        <div className='flex min-w-0 flex-1 flex-col'>
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
    </div>
  );
}
