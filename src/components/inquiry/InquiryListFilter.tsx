'use client';

import { InquiryStatus } from '@/lib/inquiries/types';
import Input, { SelectOption } from '../inputs';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ActionButton } from '../buttons/Buttons';

const INQUIRY_STATUS: SelectOption[] = [
  { label: '전체 상태', value: '' },
  { label: '답변 완료', value: 'COMPLETED' },
  { label: '답변 대기', value: 'WAITING' },
];

interface InquiryListFilterProps {
  status?: InquiryStatus;
  keyword?: string;
}

export default function InquiryListFilter({ status, keyword }: InquiryListFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [statusValue, setStatusValue] = useState<string>(status ?? '');
  const [keywordValue, setKeywordValue] = useState(keyword ?? '');

  const applyFilter = (nextStatus: string, nextKeyword: string) => {
    const params = new URLSearchParams();

    if (nextStatus) params.set('status', nextStatus);
    if (nextKeyword.trim()) params.set('keyword', nextKeyword.trim());

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleSearch = () => applyFilter(statusValue, keywordValue);

  const handleReset = () => {
    setStatusValue('');
    setKeywordValue('');
    router.push(pathname, { scroll: false });
  };

  const handleStatusChange = (value: string) => {
    setStatusValue(value);
    applyFilter(value, keyword ?? '');
  };

  return (
    <div className='flex gap-3 border border-[#EAECF0] p-3'>
      <Input
        type='select'
        options={INQUIRY_STATUS}
        value={statusValue}
        onChange={handleStatusChange}
        containerClassName='h-12 placeholder:text-[#667085] shrink-0'
      />
      <Input
        type='search'
        value={keywordValue}
        onChange={(e) => setKeywordValue(e.target.value)}
        onSearch={handleSearch}
        placeholder='문의 제목 검색'
        containerClassName='h-12 min-w-0 flex-1'
      />
      <ActionButton
        variant='brand'
        onClick={handleSearch}
        className='h-12 w-22 shrink-0 rounded-lg px-4 text-[14px] leading-5.5 font-bold'
      >
        검색
      </ActionButton>
      <ActionButton
        variant='surface'
        onClick={handleReset}
        className='h-12 w-19 shrink-0 rounded-lg px-4 text-[14px] leading-5.5 font-bold'
      >
        초기화
      </ActionButton>
    </div>
  );
}
