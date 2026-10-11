'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import FieldWrapper, { useFieldIds, type FieldBaseProps } from './FieldWrapper';
import { fieldVariants } from './styles';
import {
  REQUIRED_MESSAGE,
  REQUIRED_PLACEHOLDER,
  useFieldValidation,
  type ValidationProps,
} from './validation';

export interface TextareaFieldProps
  extends
    FieldBaseProps,
    ValidationProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'required'> {
  type: 'textarea';
}

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      label,
      required,
      hint,
      error,
      containerClassName,
      type: _type,
      placeholder,
      validate,
      patternMessage,
      className,
      id,
      onChange,
      onBlur,
      onInvalid,
      ...props
    },
    ref
  ) => {
    const ids = useFieldIds(id);
    const validation = useFieldValidation<HTMLTextAreaElement>({
      ref,
      required,
      validate,
      patternMessage,
      error,
    });
    const displayPlaceholder =
      validation.error === REQUIRED_MESSAGE ? REQUIRED_PLACEHOLDER : placeholder;

    const message = validation.error || hint;

    return (
      <FieldWrapper
        label={label}
        required={required}
        containerClassName={containerClassName}
        {...ids}
        message={message}
        isError={Boolean(validation.error)}
      >
        <textarea
          id={ids.fieldId}
          ref={validation.ref}
          required={required}
          placeholder={displayPlaceholder}
          aria-invalid={Boolean(validation.error) || undefined}
          aria-describedby={message ? ids.messageId : undefined}
          className={cn(
            fieldVariants({ variant: 'textarea', hasError: Boolean(validation.error) }),
            className
          )}
          onChange={(e) => {
            validation.handleChange(e);
            onChange?.(e);
          }}
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

TextareaField.displayName = 'TextareaField';

export default TextareaField;
