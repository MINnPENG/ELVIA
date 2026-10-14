import { submitInquiryAction } from '@/app/inquiry-list/create-inquiry/actions';
import type { CreatedInquiry } from '@/lib/inquiries/schema';
import { Validator } from './validation';

export interface InquiryFormValues {
  type: string;
  productName: string;
  name: string;
  email: string;
  title: string;
  content: string;
  password: string;
  file: File | null;
}

export const INITIAL_INQUIRY: InquiryFormValues = {
  type: '',
  productName: '',
  name: '',
  email: '',
  title: '',
  content: '',
  password: '',
  file: null,
};

export const TITLE_MAX_LENGTH = 80;
export const FILE_MAX_SIZE = 10 * 1024 * 1024; // 10MB

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{4,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validatePassword: Validator = (value) =>
  PASSWORD_REGEX.test(value) ? undefined : '영문과 숫자를 포함해 4자 이상 입력해 주세요.';

export const validateEmail: Validator = (value) =>
  EMAIL_REGEX.test(value.trim()) ? undefined : '이메일 형식이 올바르지 않습니다.';

export async function submitInquiry(
  values: InquiryFormValues,
  agreed: boolean
): Promise<CreatedInquiry> {
  const formData = new FormData();
  formData.set('type', values.type);
  formData.set('productName', values.productName);
  formData.set('name', values.name);
  formData.set('email', values.email);
  formData.set('title', values.title);
  formData.set('content', values.content);
  formData.set('password', values.password);
  formData.set('consent', String(agreed));
  if (values.file) formData.set('file', values.file);

  const result = await submitInquiryAction(formData);
  if (!result.ok) throw new Error(result.error);
  return result.inquiry;
}
