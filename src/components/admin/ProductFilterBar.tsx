'use client';

import { CATEGORY_FILTER_OPTIONS, VISIBILITY_FILTER_OPTIONS } from '@/lib/admin/productFilter';
import SelectField from '../inputs/SelecField';
import AdminFilterBar from './AdminFilterBar';
import FilterTap from './FilterTap';
import { useUrlFilters } from './useUrlFilterBar';

const KEYS = ['category', 'visibility', 'search'] as const;

export default function ProductFilterBar() {
  const { values, setFilters, reset } = useUrlFilters(KEYS);

  return (
    <div className='rounded-lg border border-[#EAECF0] bg-[#F8FAFC] p-3'>
      <AdminFilterBar
        searchValue={values.search}
        searchPlaceholder='제품명 또는 모델명 검색'
        onSearch={(search) => setFilters({ search })}
        onReset={reset}
      >
        <SelectField
          type='select'
          containerClassName='shrink-0 [&>p]:hidden'
          options={CATEGORY_FILTER_OPTIONS}
          value={values.category}
          onChange={(category) => setFilters({ category })}
        />
        <FilterTap
          ariaLabel='노출 상태'
          options={[...VISIBILITY_FILTER_OPTIONS]}
          value={values.visibility}
          onChange={(visibility) => setFilters({ visibility })}
        />
      </AdminFilterBar>
    </div>
  );
}
