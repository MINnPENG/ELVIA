'use client';

import { cn } from '@/utils/cn';

interface ChipGroupProps<T extends string> {
  label: string;
  required?: boolean;
  options: { label: string; value: T }[];
  value: T[];
  onChange: (value: T[]) => void;
}

export default function ChipGroup<T extends string>({
  label,
  required,
  options,
  value,
  onChange,
}: ChipGroupProps<T>) {
  const toggle = (optionValue: T) =>
    onChange(
      value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue]
    );

  return (
    <div className='flex flex-col'>
      <span className='mb-1.5 text-[14px] leading-5 font-bold text-[#101828]'>
        {label}
        {required && <span aria-hidden> *</span>}
      </span>

      <div role='group' aria-label={label} className='flex flex-wrap gap-2'>
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <button
              key={option.value}
              type='button'
              aria-pressed={isSelected}
              onClick={() => toggle(option.value)}
              className={cn(
                'h-9 cursor-pointer rounded-md border px-4 text-[13px] transition-colors',
                isSelected
                  ? 'border-[#101828] bg-[#F2F4F7] font-semibold text-[#101828]'
                  : 'border-[#D0D5DD] bg-white text-[#344054] hover:bg-gray-50'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
