'use client';

'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import FieldWrapper, { useFieldIds, type FieldBaseProps } from './FieldWrapper';
import { fieldVariants } from './styles';

export interface TextareaFieldProps
  extends FieldBaseProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'required'> {
  type: 'textarea';
}

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    { label, required, hint, error, containerClassName, type: _type, className, id, ...props },
    ref
  ) => {
    const ids = useFieldIds(id);
    const message = error || hint;

    return (
      <FieldWrapper
        label={label}
        required={required}
        containerClassName={containerClassName}
        {...ids}
        message={message}
        isError={Boolean(error)}
      >
        <textarea
          id={ids.fieldId}
          ref={ref}
          aria-required={required || undefined}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={message ? ids.messageId : undefined}
          className={cn(
            fieldVariants({ variant: 'textarea', hasError: Boolean(error) }),
            className
          )}
          {...props}
        />
      </FieldWrapper>
    );
  }
);

TextareaField.displayName = 'TextareaField';

export default TextareaField;
