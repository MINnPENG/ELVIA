import { cva } from 'class-variance-authority';

export const fieldVariants = cva(
  'rounded-lg w-full border text-[14px] leading-5.5 text-[#101828] bg-white outline-none focus:ring-1 placeholder:text-[#667085]',
  {
    variants: {
      variant: {
        default: 'px-4 py-3.25 h-12',
        textarea: 'p-5 h-42.5',
        search: 'px-4 h-12',
      },
      hasError: {
        true: 'border-[#D92D20] placeholder:text-[#D92D20] focus:border-[#D92D20] focus:ring-[#D92D20]',
        false: 'border-[#D0D5DD] focus:border-[#101828] focus:ring-[#101828]',
      },
    },
    defaultVariants: {
      variant: 'default',
      hasError: false,
    },
  }
);
