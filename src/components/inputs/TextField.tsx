'use client';

import { ChangeEvent, forwardRef, InputHTMLAttributes, KeyboardEvent } from 'react';
import FieldWrapper, { FieldBaseProps, useFieldIds } from './FieldWrapper';
import { cn } from '@/utils/cn';
import { fieldVariants } from './styles';
import {
  REQUIRED_MESSAGE,
  REQUIRED_PLACEHOLDER,
  useFieldValidation,
  ValidationProps,
} from './validation';

type TextType = 'text' | 'email' | 'password' | 'number' | 'search';

export interface TextFieldProps
  extends
    FieldBaseProps,
    ValidationProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'required'> {
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
      validate,
      patternMessage,
      onInvalid,
      onBlur,
      className,
      placeholder,
      id,
      onChange,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const ids = useFieldIds(id);
    const validation = useFieldValidation<HTMLInputElement>({
      ref,
      required,
      validate,
      patternMessage,
      error,
    });
    const displayPlaceholder =
      validation.error === REQUIRED_MESSAGE ? REQUIRED_PLACEHOLDER : placeholder;

    const isSearch = type === 'search';
    const isNumber = type === 'number';

    const inputType = isSearch || isNumber ? 'text' : type;

    const message = validation.error || hint;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (isNumber) e.target.value = e.target.value.replace(/\D/g, '');
      validation.handleChange(e);
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
        isError={Boolean(validation.error)}
        hideMessage={isSearch}
      >
        <input
          id={ids.fieldId}
          required={required}
          ref={validation.ref}
          type={inputType}
          placeholder={displayPlaceholder}
          inputMode={isNumber ? 'numeric' : undefined}
          enterKeyHint={isSearch ? 'search' : undefined}
          aria-invalid={Boolean(validation.error) || undefined}
          aria-describedby={message ? ids.messageId : undefined}
          className={cn(
            fieldVariants({
              variant: isSearch ? 'search' : 'default',
              hasError: Boolean(validation.error),
            }),
            className
          )}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={(e) => {
            validation.handleBlur(e);
            onBlur?.(e);
          }}
          onInvalid={(e) => {
            validation.handleInvalid(e);
            onInvalid?.(e);
          }}
          {...props}
        />
      </FieldWrapper>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
