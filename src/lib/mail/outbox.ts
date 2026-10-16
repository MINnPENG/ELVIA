import 'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';

import { isMailConfigured, sendMail, type MailMessage } from './send';

export type OutboxEventType = 'INQUIRY_RECEIVED' | 'ANSWER_COMPLETED';

/** 수신자를 뺀 메일 내용. 수신자는 outbox 행의 recipient_email을 쓴다. */
export type BuildMessage = (inquiryId: string) => Promise<Omit<MailMessage, 'to'> | null>;

/** 발송할 메일을 outbox에 PENDING으로 쌓는다. 쌓지 못해도 던지지 않고 false를 돌려준다. */
export async function enqueueMail(
  inquiryId: string,
  recipientEmail: string,
  eventType: OutboxEventType
): Promise<boolean> {
  const { error } = await supabaseAdmin.from('email_outbox').insert({
    inquiry_id: inquiryId,
    recipient_email: recipientEmail,
    event_type: eventType,
    payload: { inquiry_id: inquiryId },
  });
  if (error) console.error('[enqueueMail]', eventType, error.message);
  return !error;
}

/**
 * outbox에서 PENDING인 해당 이벤트 메일을 하나 집어 보내고 결과를 기록한다.
 * 실패해도 던지지 않는다. 본 작업(문의 접수, 답변 등록)은 이미 끝난 상태이기 때문이다.
 */
export async function deliverMail(
  inquiryId: string,
  eventType: OutboxEventType,
  build: BuildMessage
): Promise<boolean> {
  try {
    const { data: row, error } = await supabaseAdmin
      .from('email_outbox')
      .select('id, recipient_email, retry_count')
      .eq('inquiry_id', inquiryId)
      .eq('event_type', eventType)
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return false;

    if (!isMailConfigured()) {
      console.warn('[mail] RESEND_API_KEY / MAIL_FROM 이 없어 메일을 보내지 않았습니다.');
      return false; // PENDING으로 남겨 두었다가 설정 후 다시 보낼 수 있게 한다.
    }

    // 다른 요청이 같은 메일을 동시에 보내지 않도록 PENDING인 행만 선점한다.
    const { data: claimed } = await supabaseAdmin
      .from('email_outbox')
      .update({ status: 'PROCESSING' })
      .eq('id', row.id)
      .eq('status', 'PENDING')
      .select('id');
    if (!claimed?.length) return false;

    const fail = async (detail: string) => {
      await supabaseAdmin
        .from('email_outbox')
        .update({ status: 'FAILED', retry_count: row.retry_count + 1, last_error: detail })
        .eq('id', row.id);
      return false;
    };

    // 내용을 만들다 던져도 행이 PROCESSING에 멈추지 않도록 FAILED로 기록한다.
    let message: Awaited<ReturnType<BuildMessage>>;
    try {
      message = await build(inquiryId);
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
    if (!message) return fail('메일 내용을 만들 문의를 찾지 못했습니다.');

    const result = await sendMail({ ...message, to: row.recipient_email });
    if (!result.ok) return fail(result.error);

    await supabaseAdmin
      .from('email_outbox')
      .update({ status: 'SENT', sent_at: new Date().toISOString(), last_error: null })
      .eq('id', row.id);
    return true;
  } catch (e) {
    console.error('[deliverMail]', eventType, e);
    return false;
  }
}
