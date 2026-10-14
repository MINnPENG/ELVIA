'use server';

import { verifyInquiryCredentials } from '@/lib/inquiries/access';
import { isUuid } from '@/lib/inquiries/queries';
import { grantInquiryAccess } from '@/lib/inquiries/session';
import type { InquiryAccessResult } from '@/lib/inquiries/types';

/** 본인 확인. 성공하면 30분짜리 접근 쿠키를 심고, 화면은 `/inquiry-list/[id]`로 이동하면 된다. */
export async function verifyInquiryAccessAction(
  id: string,
  nameOrEmail: string,
  password: string
): Promise<InquiryAccessResult> {
  if (!isUuid(id)) return { ok: false, error: '문의를 찾을 수 없습니다.' };
  if (!nameOrEmail.trim() || !password) {
    return { ok: false, error: '이메일과 비밀번호를 입력해 주세요.' };
  }
  // 비정상적으로 긴 입력으로 해시 비교 비용을 키우지 못하게 한다.
  if (nameOrEmail.length > 254 || password.length > 100) {
    return { ok: false, error: '입력값이 너무 깁니다.' };
  }

  try {
    const result = await verifyInquiryCredentials(id, nameOrEmail, password);
    if (result.ok) await grantInquiryAccess(id);
    return result;
  } catch (e) {
    console.error('[verifyInquiryAccessAction]', e);
    return {
      ok: false,
      error: '문의를 확인하는 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.',
    };
  }
}
