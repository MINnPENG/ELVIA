'use server';

import { verifyInquiryAccess } from '@/lib/inquiries/access';
import { isUuid } from '@/lib/inquiries/queries';
import type { InquiryAccessResult } from '@/lib/inquiries/types';

export async function verifyInquiryAccessAction(
  id: string,
  nameOrEmail: string,
  password: string
): Promise<InquiryAccessResult> {
  if (!isUuid(id)) return { ok: false, error: '문의를 찾을 수 없습니다.' };
  if (!nameOrEmail.trim() || !password) {
    return { ok: false, error: '이름(또는 이메일)과 비밀번호를 입력해 주세요.' };
  }
  // 비정상적으로 긴 입력으로 해시 비교 비용을 키우지 못하게 한다.
  if (nameOrEmail.length > 254 || password.length > 100) {
    return { ok: false, error: '입력값이 너무 깁니다.' };
  }

  try {
    return await verifyInquiryAccess(id, nameOrEmail, password);
  } catch (e) {
    console.error('[verifyInquiryAccessAction]', e);
    return {
      ok: false,
      error: '문의를 불러오는 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.',
    };
  }
}
