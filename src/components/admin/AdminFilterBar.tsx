'use client';

import { ReactNode, FormEvent, useState } from 'react';
import TextField from '../inputs/TextField';
import { ActionButton, SubmitButton } from '../buttons/Buttons';

interface AdminFilterBarProps {
  children: ReactNode;
  searchValue: string;
  searchPlaceholder: string;
  onSearch: (keyword: string) => void;
  onReset: () => void;
}

export default function AdminFilterBar({
  children,
  searchValue,
  searchPlaceholder,
  onSearch,
  onReset,
}: AdminFilterBarProps) {
  const [resetCount, setResetCount] = useState(0);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const keyword = new FormData(e.currentTarget).get('search');
    onSearch(String(keyword ?? '').trim());
  };

  const handleReset = () => {
    setResetCount((count) => count + 1);
    onReset();
  };

  return (
    <form role='search' onSubmit={handleSubmit} className='flex flex-wrap gap-3'>
      <div className='flex flex-wrap items-center gap-3'>{children}</div>
      <div className='flex w-full min-w-0 items-center gap-3 lg:ml-auto lg:w-auto lg:max-w-157 lg:flex-1'>
        <TextField
          key={`${searchValue}-${resetCount}`}
          type='search'
          name='search'
          defaultValue={resetCount > 0 && !searchValue ? '' : searchValue}
          placeholder={searchPlaceholder}
          aria-label='검색어'
          onSearch={(v) => onSearch(v.trim())}
          containerClassName='min-w-0 flex-1'
        />
        <SubmitButton
          variant='brand'
          className='h-12 w-22 rounded-lg px-4 text-[14px] leading-5 font-bold'
        >
          검색
        </SubmitButton>
        <ActionButton
          variant='surface'
          onClick={handleReset}
          className='h-12 w-18 rounded-lg px-4 text-[14px] leading-5 font-bold'
        >
          초기화
        </ActionButton>
      </div>
    </form>
  );
}
