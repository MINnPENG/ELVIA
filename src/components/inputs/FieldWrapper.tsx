import { cn } from '@/utils/cn';
import { ReactNode, useId } from 'react';

export interface FieldBaseProps {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export function useFieldIds(id?: string) {
  const generated = useId();
  const fieldId = id ?? generated;

  return { fieldId, labelId: `${fieldId}-label`, messageId: `${fieldId}-message` };
}

interface FieldWrapperProps extends Omit<FieldBaseProps, 'hint' | 'error'> {
  fieldId: string;
  labelId: string;
  messageId: string;
  message?: string;
  isError: boolean;
  hideMessage?: boolean;
  children: ReactNode;
}

export default function FieldWrapper({
  label,
  required,
  containerClassName,
  fieldId,
  labelId,
  messageId,
  message,
  isError,
  hideMessage,
  children,
}: FieldWrapperProps) {
  return (
    <div className={cn('flex flex-col', containerClassName)}>
      {label && (
        <label
          id={labelId}
          htmlFor={fieldId}
          className='mb-1.5 text-[14px] leading-5 font-bold text-[#101828]'
        >
          {label}
          {required && <span aria-hidden> *</span>}
        </label>
      )}

      {children}

      {!hideMessage && (
        <p
          id={messageId}
          role={isError ? 'alert' : undefined}
          className={cn(
            'mt-1.5 min-h-4.5 text-[12px] leading-4.5',
            isError ? 'text-[#D92D20]' : 'text-[#667085]',
            !message && 'invisible'
          )}
        >
          {message || 'placeholder'}
        </p>
      )}
    </div>
  );
}
