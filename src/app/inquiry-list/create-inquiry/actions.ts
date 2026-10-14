'use server';

import { createInquiry, InquiryError } from '@/lib/inquiries/create';
import { inquirySchema, type CreatedInquiry } from '@/lib/inquiries/schema';

export type SubmitInquiryResult =
  { ok: true; inquiry: CreatedInquiry } | { ok: false; error: string };

export async function submitInquiryAction(formData: FormData): Promise<SubmitInquiryResult> {
  const parsed = inquirySchema.safeParse({
    type: formData.get('type'),
    productName: formData.get('productName') ?? '',
    name: formData.get('name'),
    email: formData.get('email'),
    title: formData.get('title'),
    content: formData.get('content'),
    password: formData.get('password'),
    consent: formData.get('consent') === 'true',
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? '입력값을 확인해 주세요.' };
  }

  const file = formData.get('file');
  try {
    const inquiry = await createInquiry(
      parsed.data,
      file instanceof File && file.size > 0 ? file : null
    );
    return { ok: true, inquiry };
  } catch (e) {
    if (e instanceof InquiryError) return { ok: false, error: e.message };
    // 내부 오류 내용은 고객에게 보여주지 않고 서버 로그에만 남긴다.
    console.error('[submitInquiryAction]', e);
    return { ok: false, error: '문의 접수 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.' };
  }
}
