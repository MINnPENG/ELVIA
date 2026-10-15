'use server';

import { revalidatePath } from 'next/cache';

import { sendAnswerCompletedMail } from '@/lib/admin/mail';
import { requireAdmin } from '@/lib/auth/require-admin';
import { isUuid } from '@/lib/inquiries/queries';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export type AnswerActionResult = { ok: true; mailSent?: boolean } | { ok: false; error: string };

type AnswerInput = { inquiryId: string; content: string };

const FALLBACK_ERROR = '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
const ALREADY_SUBMITTED = '이미 답변이 등록된 문의입니다. 등록된 답변은 수정할 수 없습니다.';
const CONTENT_MAX = 5000;

function validate({ inquiryId, content }: AnswerInput) {
  if (!isUuid(inquiryId)) return '문의를 찾을 수 없습니다.';
  if (!content.trim()) return '답변을 입력해 주세요.';
  if (content.trim().length > CONTENT_MAX) return `답변은 ${CONTENT_MAX}자 이하로 입력해 주세요.`;
  return null;
}

/** 임시 저장. 문의 상태는 바꾸지 않고 메일도 보내지 않는다. 문의당 임시 저장은 한 건만 둔다. */
export async function saveAnswerDraft(input: AnswerInput): Promise<AnswerActionResult> {
  const admin = await requireAdmin();
  const invalid = validate(input);
  if (invalid) return { ok: false, error: invalid };

  try {
    const content = input.content.trim();
    const { data: submitted, error: checkError } = await supabaseAdmin
      .from('inquiry_answers')
      .select('id')
      .eq('inquiry_id', input.inquiryId)
      .eq('status', 'SUBMITTED')
      .maybeSingle();
    if (checkError) throw new Error(checkError.message);
    if (submitted) return { ok: false, error: ALREADY_SUBMITTED };

    const now = new Date().toISOString();
    const { data: existing, error: findError } = await supabaseAdmin
      .from('inquiry_answers')
      .select('id')
      .eq('inquiry_id', input.inquiryId)
      .eq('status', 'DRAFT')
      .maybeSingle();
    if (findError) throw new Error(findError.message);

    const { error } = existing
      ? await supabaseAdmin
          .from('inquiry_answers')
          .update({ content, admin_id: admin.id, saved_at: now })
          .eq('id', existing.id)
      : await supabaseAdmin.from('inquiry_answers').insert({
          inquiry_id: input.inquiryId,
          admin_id: admin.id,
          content,
          status: 'DRAFT',
          saved_at: now,
        });
    if (error) throw new Error(error.message);

    return { ok: true };
  } catch (e) {
    console.error('[saveAnswerDraft]', e);
    return { ok: false, error: FALLBACK_ERROR };
  }
}

/**
 * 답변 등록. 답변 저장 + 상태 '답변 완료' 변경은 DB 함수(submit_inquiry_answer)가 한 번에 처리하고,
 * 그 뒤에 고객에게 알림 메일을 보낸다. 메일이 실패해도 등록은 유지된다.
 */
export async function submitAnswer(input: AnswerInput): Promise<AnswerActionResult> {
  await requireAdmin();
  const invalid = validate(input);
  if (invalid) return { ok: false, error: invalid };

  // 관리자 본인 세션으로 호출해야 DB 함수가 로그인한 관리자를 알 수 있다.
  const supabase = await createClient();
  const { error } = await supabase.rpc('submit_inquiry_answer', {
    p_inquiry_id: input.inquiryId,
    p_content: input.content.trim(),
  });

  if (error) {
    console.error('[submitAnswer]', error);
    return {
      ok: false,
      error: /already|이미/i.test(error.message) ? ALREADY_SUBMITTED : FALLBACK_ERROR,
    };
  }

  const mailSent = await sendAnswerCompletedMail(input.inquiryId);
  revalidatePath('/admin/inquiries');
  return { ok: true, mailSent };
}
