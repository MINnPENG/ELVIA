'use client';

import { cn } from '@/utils/cn';

export interface FilterTapOption<T extends string = string> {
  label: string;
  value: T;
}

interface FilterTapProps<T extends string> {
  options: FilterTapOption<T>[];
  value: string;
  onChange: (value: T) => void;
  ariaLabel: string;
}

export default function FilterTap<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: FilterTapProps<T>) {
  return (
    <div
      role='radiogroup'
      aria-label={ariaLabel}
      className='flex h-12 shrink-0 items-center gap-1 rounded-lg border border-[#D0D5DD] bg-white p-1'
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            className={cn(
              'h-full min-w-18 cursor-pointer rounded-md px-5 text-[14px] leading-5 transition-colors',
              selected
                ? 'bg-[#EAF2FF] font-bold text-[#071A33]'
                : 'text-[#667085] hover:bg-[#EAF2FF] hover:text-[#071A33]'
            )}
            type='button'
            role='radio'
            aria-checked={selected}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
