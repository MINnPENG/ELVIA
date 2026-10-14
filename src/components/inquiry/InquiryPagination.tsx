'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Pagination } from '@/public/Pagination';

export default function InquiryPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (next: number) => {
    // 필터는 유지하고, 페이지가 바뀌면 선택은 해제한다.
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(next));
    params.delete('selected');
    router.push(`?${params}`, { scroll: false });
  };

  return <Pagination page={page} totalPages={totalPages} onChange={handleChange} />;
}
