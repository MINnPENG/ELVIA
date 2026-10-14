import { z } from 'zod';

export const INQUIRY_TITLE_MAX = 80;
export const INQUIRY_CONTENT_MAX = 5000;
export const INQUIRY_FILE_MAX_SIZE = 10 * 1024 * 1024; // 10MB (inquiry-attachments 버킷 제한과 동일)
export const INQUIRY_FILE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
] as const;

/** 폼의 문의 유형 값 → DB enum(inquiry_type) */
export const INQUIRY_TYPE_MAP = {
  repair: 'REPAIR',
  purchase: 'PURCHASE',
  product: 'PRODUCT_USAGE',
} as const;

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{4,}$/;

export const inquirySchema = z.object({
  type: z.enum(['repair', 'purchase', 'product'], { error: '문의 유형을 선택해 주세요.' }),
  productName: z.string().trim().max(100, '제품명은 100자 이하로 입력해 주세요.'),
  name: z
    .string()
    .trim()
    .min(1, '이름을 입력해 주세요.')
    .max(50, '이름은 50자 이하로 입력해 주세요.'),
  email: z.email('이메일 형식이 올바르지 않습니다.').max(254, '이메일이 너무 깁니다.'),
  title: z
    .string()
    .trim()
    .min(1, '문의 제목을 입력해 주세요.')
    .max(INQUIRY_TITLE_MAX, `문의 제목은 ${INQUIRY_TITLE_MAX}자 이하로 입력해 주세요.`),
  content: z
    .string()
    .trim()
    .min(1, '문의 내용을 입력해 주세요.')
    .max(INQUIRY_CONTENT_MAX, `문의 내용은 ${INQUIRY_CONTENT_MAX}자 이하로 입력해 주세요.`),
  // bcrypt는 72바이트까지만 해시에 반영한다.
  password: z
    .string()
    .regex(PASSWORD_REGEX, '비밀번호는 영문과 숫자를 포함해 4자 이상이어야 합니다.')
    .refine((v) => new TextEncoder().encode(v).length <= 72, '비밀번호가 너무 깁니다.'),
  consent: z.literal(true, { error: '개인정보 수집·이용에 동의해 주세요.' }),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export type CreatedInquiry = {
  inquiryNo: string;
  inquiryType: keyof typeof INQUIRY_TYPE_MAP;
  email: string;
  createdAt: string;
};
