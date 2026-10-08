import type { AccessMethod } from '@/mock/product';
import { Fragment } from 'react/jsx-runtime';

const chipStyles = {
  card: 'text-[13px] rounded-[10px] h-[34px]',
  detail: 'text-[14px] rounded-[21px] h-[42px]',
};

type ChipVariant = keyof typeof chipStyles;

type AccessChipProps = {
  methods: AccessMethod[];
  variant?: ChipVariant;
  className?: string;
};

export default function AccessChip({
  methods,
  variant = 'detail',
  className = '',
}: AccessChipProps) {
  if (methods.length === 0) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 bg-[#F5F7FA] px-6 font-medium whitespace-nowrap text-[#616B7A] ${chipStyles[variant]} ${className}`}
    >
      {methods.map((m, i) => (
        <Fragment key={m.id}>
          {i > 0 && <span aria-hidden='true'>·</span>}
          {m.name}
        </Fragment>
      ))}
    </span>
  );
}
