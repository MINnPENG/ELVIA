'use client';

import { forwardRef, useState, type KeyboardEvent } from 'react';
import { cn } from '@/utils/cn';
import FieldWrapper, { useFieldIds, type FieldBaseProps } from './FieldWrapper';
import { fieldVariants } from './styles';

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

export interface SelectFieldProps extends FieldBaseProps {
  type: 'select';
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  (
    {
      label,
      required,
      hint,
      error,
      containerClassName,
      options,
      value,
      defaultValue,
      onChange,
      onBlur,
      placeholder,
      name,
      id,
      disabled,
      className,
    },
    ref
  ) => {
    const ids = useFieldIds(id);
    const listboxId = `${ids.fieldId}-listbox`;

    const [open, setOpen] = useState(false);
    const [innerValue, setInnerValue] = useState(defaultValue ?? '');
    const [activeIndex, setActiveIndex] = useState(-1);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : innerValue;
    const selectedIndex = options.findIndex((option) => option.value === currentValue);
    const selected = options[selectedIndex];

    const message = error || selected?.description || hint;

    const openList = () => {
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      setOpen(true);
    };

    const selectOption = (option: SelectOption) => {
      if (!isControlled) setInnerValue(option.value);
      onChange?.(option.value);
      setOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!open) openList();
          else setActiveIndex((i) => Math.min(i + 1, options.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!open) openList();
          else setActiveIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (open && options[activeIndex]) selectOption(options[activeIndex]);
          else openList();
          break;
        case 'Escape':
          if (open) {
            e.preventDefault();
            setOpen(false);
          }
          break;
        case 'Tab':
          setOpen(false);
          break;
      }
    };

    return (
      <FieldWrapper
        label={label}
        required={required}
        containerClassName={containerClassName}
        {...ids}
        message={message}
        isError={Boolean(error)}
      >
        <div className='relative'>
          <button
            id={ids.fieldId}
            ref={ref}
            type='button'
            role='combobox'
            disabled={disabled}
            aria-haspopup='listbox'
            aria-expanded={open}
            aria-controls={listboxId}
            aria-labelledby={label ? ids.labelId : undefined}
            aria-activedescendant={
              open && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
            }
            aria-required={required || undefined}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={message ? ids.messageId : undefined}
            onClick={() => (open ? setOpen(false) : openList())}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setOpen(false);
              onBlur?.();
            }}
            className={cn(
              fieldVariants({ hasError: Boolean(error) }),
              'flex cursor-pointer items-center text-left',
              className,
              open && !error && 'border-[#101828] ring-1 ring-[#101828]'
            )}
          >
            <span
              className={cn('truncate', !selected && (error ? 'text-[#D92D20]' : 'text-[#667085]'))}
            >
              {selected?.label ?? placeholder}
            </span>
          </button>

          {open && (
            <ul
              id={listboxId}
              role='listbox'
              aria-labelledby={label ? ids.labelId : undefined}
              className='absolute top-full z-20 max-h-60 w-full overflow-auto rounded-lg border border-[#D0D5DD] bg-white shadow-lg'
            >
              {options.map((option, index) => {
                const isSelected = option.value === currentValue;
                return (
                  <li
                    key={option.value}
                    id={`${listboxId}-${index}`}
                    role='option'
                    aria-selected={isSelected}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectOption(option)}
                    className={cn(
                      'cursor-pointer px-4 py-3.25 text-sm text-[#101828] placeholder:text-[#667085]',
                      index === activeIndex && 'bg-gray-100',
                      isSelected && 'font-semibold'
                    )}
                  >
                    {option.label}
                  </li>
                );
              })}
            </ul>
          )}

          {name && <input type='hidden' name={name} value={currentValue} />}
        </div>
      </FieldWrapper>
    );
  }
);

SelectField.displayName = 'SelectField';

export default SelectField;
