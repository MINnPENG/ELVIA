'use client';

import { ChangeEvent, forwardRef, InputHTMLAttributes, KeyboardEvent } from 'react';
import FieldWrapper, { FieldBaseProps, useFieldIds } from './FieldWrapper';
import { cn } from '@/utils/cn';
import { fieldVariants } from './styles';

type TextType = 'text' | 'email' | 'password' | 'number' | 'search';

export interface TextFieldProps
  extends FieldBaseProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'required'> {
  type?: TextType;
  onSearch?: (value: string) => void;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      required,
      hint,
      error,
      containerClassName,
      type = 'text',
      onSearch,
      className,
      id,
      onChange,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const ids = useFieldIds(id);

    const isSearch = type === 'search';
    const isNumber = type === 'number';

    const inputType = isSearch || isNumber ? 'text' : type;

    const message = error || hint;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (isNumber) e.target.value = e.target.value.replace(/\D/g, '');
      onChange?.(e);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (isSearch && e.key === 'Enter' && !e.nativeEvent.isComposing) {
        e.preventDefault();
        onSearch?.(e.currentTarget.value);
      }
      onKeyDown?.(e);
    };

    return (
      <FieldWrapper
        label={label}
        required={required}
        containerClassName={containerClassName}
        {...ids}
        message={message}
        isError={Boolean(error)}
        hideMessage={isSearch}
      >
        <input
          id={ids.fieldId}
          ref={ref}
          type={inputType}
          inputMode={isNumber ? 'numeric' : undefined}
          enterKeyHint={isSearch ? 'search' : undefined}
          aria-required={required || undefined}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={message ? ids.messageId : undefined}
          className={cn(
            fieldVariants({ variant: isSearch ? 'search' : 'default', hasError: Boolean(error) }),
            className
          )}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </FieldWrapper>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
