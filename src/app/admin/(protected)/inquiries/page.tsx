import AdminInquiryList from '@/components/admin/AdminInquiryList';
import { requireAdmin } from '@/lib/auth/require-admin';
import { getAdminInquiryDetail } from '@/lib/admin/inquiries';
import {
  getInquiryList,
  isUuid,
  parseInquiryType,
  parsePage,
  parseStatus,
} from '@/lib/inquiries/queries';
import AdminInquiryDetailSection from '@/components/admin/AdminInquiryDetailSection';
import { Suspense } from 'react';
import InquiryFilterBar from '@/components/admin/InquiryFilterBar';

export default async function AdminInquiryPage({
  searchParams,
}: {
  searchParams: Promise<{
    selected?: string;
    page?: string;
    status?: string;
    type?: string;
    keyword?: string;
  }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = parsePage(params.page);
  const status = parseStatus(params.status);
  const type = parseInquiryType(params.type);
  const keyword = params.keyword?.trim() || undefined;
  const selectedId = isUuid(params.selected) ? params.selected : undefined;

  const [list, detail] = await Promise.all([
    getInquiryList({ page, status, type, keyword }),
    selectedId ? getAdminInquiryDetail(selectedId) : Promise.resolve(null),
  ]);

  return (
    <div className='flex flex-col gap-6'>
      <Suspense>
        <InquiryFilterBar />
      </Suspense>

      <div className='grid grid-cols-[440px_1fr] items-start gap-6'>
        <AdminInquiryList
          inquiries={list.items}
          total={list.total}
          page={page}
          totalPages={list.totalPages}
          selectedId={selectedId}
          status={status}
          keyword={keyword}
          type={type}
        />
        <AdminInquiryDetailSection selectedId={selectedId} data={detail} />
      </div>
    </div>
  );
}
