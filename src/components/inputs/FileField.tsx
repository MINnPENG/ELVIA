'use client';

import { forwardRef, useRef, useState, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import FieldWrapper, { useFieldIds, type FieldBaseProps } from './FieldWrapper';
import { fieldVariants } from './styles';

const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${Math.round(bytes / 1024 / 1024)}MB` : `${Math.round(bytes / 1024)}KB`;

export interface FileFieldProps
  extends
    FieldBaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'required' | 'value' | 'defaultValue'> {
  type: 'file';
  maxSize?: number;
  onFilesChange?: (files: File[]) => void;
}

const FileField = forwardRef<HTMLInputElement, FileFieldProps>(
  (
    {
      label,
      required,
      hint,
      error,
      containerClassName,
      type: _type,
      maxSize,
      onFilesChange,
      onChange,
      placeholder,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const ids = useFieldIds(id);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [sizeError, setSizeError] = useState('');

    const errorMessage = error || sizeError;
    const message = errorMessage || hint;

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const updateFiles = (next: File[]) => {
      setFiles(next);
      onFilesChange?.(next);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files ?? []);

      if (maxSize && selected.some((file) => file.size > maxSize)) {
        setSizeError(`파일 크기는 ${formatBytes(maxSize)} 이하만 첨부할 수 있습니다.`);
        e.target.value = '';
        updateFiles([]);
        return;
      }

      setSizeError('');
      updateFiles(selected);
      onChange?.(e);
    };

    const handleClear = () => {
      if (inputRef.current) inputRef.current.value = '';
      setSizeError('');
      updateFiles([]);
    };

    const fileLabel =
      files.length === 0
        ? null
        : files.length === 1
          ? files[0].name
          : `${files[0].name} 외 ${files.length - 1}개`;

    return (
      <FieldWrapper
        label={label}
        required={required}
        containerClassName={containerClassName}
        {...ids}
        message={message}
        isError={Boolean(errorMessage)}
      >
        <div className='relative'>
          <input
            ref={setRefs}
            type='file'
            className='hidden'
            tabIndex={-1}
            disabled={disabled}
            onChange={handleChange}
            {...props}
          />

          <button
            id={ids.fieldId}
            type='button'
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            aria-describedby={message ? ids.messageId : undefined}
            className={cn(
              fieldVariants({ hasError: Boolean(errorMessage) }),
              'flex cursor-pointer items-center text-left',
              fileLabel && 'pr-16',
              className
            )}
          >
            <span className={cn('truncate', !fileLabel && 'text-gray-400')}>
              {fileLabel ?? placeholder}
            </span>
          </button>

          {fileLabel && !disabled && (
            <button
              type='button'
              onClick={handleClear}
              aria-label='첨부파일 삭제'
              className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded px-2 py-1 text-xs text-gray-500 hover:text-gray-700'
            >
              삭제
            </button>
          )}
        </div>
      </FieldWrapper>
    );
  }
);

FileField.displayName = 'FileField';

export default FileField;
