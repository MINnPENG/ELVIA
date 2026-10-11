import {
  ChangeEvent,
  FocusEvent,
  ForwardedRef,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export const REQUIRED_MESSAGE = '필수 항목입니다.';
export const REQUIRED_PLACEHOLDER = '필수 입력값을 입력해 주세요.';

export type Validator = (value: string) => string | undefined;

export interface ValidationProps {
  validate?: Validator;
  patternMessage?: string;
}

type ValidatableElement = HTMLInputElement | HTMLTextAreaElement;

export function assignRef<T>(ref: ForwardedRef<T>, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
}

function syncCustomValidity(el: ValidatableElement, required?: boolean, validate?: Validator) {
  const { value } = el;
  let message: string | undefined;

  if (required && value !== '' && !value.trim()) message = REQUIRED_MESSAGE;
  else if (value && validate) message = validate(value);

  el.setCustomValidity(message ?? '');
}

function getErrorMessage(el: ValidatableElement, patternMessage?: string) {
  const { validity } = el;

  if (validity.valueMissing) return REQUIRED_MESSAGE;
  if (validity.typeMismatch)
    return el.type === 'email' ? '이메일 형식이 올바르지 않습니다.' : '형식이 올바르지 않습니다.';
  if (validity.patternMismatch) return patternMessage ?? '형식이 올바르지 않습니다.';
  if (validity.tooShort) return `${el.minLength}자 이상 입력해 주세요.`;
  if (validity.customError) return el.validationMessage;
  return undefined;
}

interface UseFieldValidationOptions<T> extends ValidationProps {
  ref: ForwardedRef<T>;
  required?: boolean;
  error?: string;
}

export function useFieldValidation<T extends ValidatableElement>({
  ref,
  required,
  validate,
  patternMessage,
  error,
}: UseFieldValidationOptions<T>) {
  const elementRef = useRef<T | null>(null);
  const [internalError, setInternalError] = useState<string>();

  useEffect(() => {
    if (elementRef.current) syncCustomValidity(elementRef.current, required, validate);
  });

  const setRef = useCallback(
    (node: T | null) => {
      elementRef.current = node;
      assignRef(ref, node);
    },
    [ref]
  );

  const check = (el: T) => {
    syncCustomValidity(el, required, validate);
    setInternalError(getErrorMessage(el, patternMessage));
  };

  return {
    ref: setRef,
    error: error || internalError,
    handleBlur: (e: FocusEvent<T>) => check(e.currentTarget),
    handleChange: (e: ChangeEvent<T>) => {
      if (internalError) check(e.currentTarget);
    },
    handleInvalid: (e: SyntheticEvent<T>) => {
      e.preventDefault();
      const el = e.currentTarget;
      setInternalError(getErrorMessage(el, patternMessage));
      if (el.form?.querySelector(':invalid') === el) el.focus();
    },
  };
}
