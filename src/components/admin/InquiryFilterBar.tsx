'use client';

import {
  INQUIRY_STATUS_LABEL,
  INQUIRY_TYPE_LABEL,
  InquiryStatus,
  InquiryType,
} from '@/lib/inquiries/types';
import SelectField, { SelectOption } from '../inputs/SelecField';
import AdminFilterBar from './AdminFilterBar';
import FilterTap, { FilterTapOption } from './FilterTap';
import { useUrlFilters } from './useUrlFilterBar';

const STATUS_OPTIONS: FilterTapOption[] = [
  { label: '전체', value: '' },
  ...(Object.keys(INQUIRY_STATUS_LABEL) as InquiryStatus[]).map((value) => ({
    label: INQUIRY_STATUS_LABEL[value],
    value,
  })),
];

const TYPE_OPTIONS: SelectOption[] = [
  { label: '전체 문의 유형', value: '' },
  ...(Object.keys(INQUIRY_TYPE_LABEL) as InquiryType[]).map((value) => ({
    label: INQUIRY_TYPE_LABEL[value],
    value,
  })),
];

const KEYS = ['status', 'type', 'keyword'] as const;

export default function InquiryFilterBar() {
  const { values, setFilters, reset } = useUrlFilters(KEYS, {
    clearOnChange: ['page', 'selected'],
  });

  return (
    <div className='rounded-lg border border-[#EAECF0] bg-[#F8FAFC] p-3'>
      <AdminFilterBar
        searchValue={values.keyword}
        searchPlaceholder='제목 또는 문의 번호 검색'
        onSearch={(keyword) => setFilters({ keyword })}
        onReset={reset}
      >
        <FilterTap
          ariaLabel='답변 상태'
          options={STATUS_OPTIONS}
          value={values.status}
          onChange={(status) => setFilters({ status })}
        />
        <SelectField
          type='select'
          containerClassName='shrink-0 [&>p]:hidden'
          options={TYPE_OPTIONS}
          value={values.type}
          onChange={(type) => setFilters({ type })}
        />
      </AdminFilterBar>
    </div>
  );
}
