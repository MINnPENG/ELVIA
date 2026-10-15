import 'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';

const EVENT_TYPE = 'ANSWER_COMPLETED';

// 메일 발송 서비스는 Resend를 쓴다. 환경변수가 없으면 보내지 않고 outbox에 PENDING으로 남겨 둔다.
function getMailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  return apiKey && from ? { apiKey, from } : null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * 답변 등록 시 DB 함수가 email_outbox에 쌓아 둔 "답변 완료" 메일을 보낸다.
 * 답변 등록 자체는 이미 끝난 상태이므로, 실패해도 던지지 않고 false를 돌려준다.
 */
export async function sendAnswerCompletedMail(inquiryId: string): Promise<boolean> {
  try {
    const { data: row, error } = await supabaseAdmin
      .from('email_outbox')
      .select('id, recipient_email, retry_count')
      .eq('inquiry_id', inquiryId)
      .eq('event_type', EVENT_TYPE)
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return false;

    const config = getMailConfig();
    if (!config) {
      console.warn('[mail] RESEND_API_KEY / MAIL_FROM 이 없어 메일을 보내지 않았습니다.');
      return false;
    }

    // 다른 요청이 같은 메일을 동시에 보내지 않도록 PENDING인 행만 선점한다.
    const { data: claimed } = await supabaseAdmin
      .from('email_outbox')
      .update({ status: 'PROCESSING' })
      .eq('id', row.id)
      .eq('status', 'PENDING')
      .select('id');
    if (!claimed?.length) return false;

    const { data: inquiry } = await supabaseAdmin
      .from('inquiries')
      .select('inquiry_no, title, customer_name')
      .eq('id', inquiryId)
      .maybeSingle();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
    const link = siteUrl ? `${siteUrl}/inquiry-list/${inquiryId}` : null;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: config.from,
        to: [row.recipient_email],
        subject: `[ELVIA] 문의하신 내용에 답변이 등록되었습니다${inquiry ? ` (${inquiry.inquiry_no})` : ''}`,
        // 문의 내용·답변은 메일에 담지 않는다. 본인 확인 후 사이트에서 보게 한다.
        html: `<p>${escapeHtml(inquiry?.customer_name ?? '고객')}님, 문의하신 「${escapeHtml(inquiry?.title ?? '문의')}」에 답변이 등록되었습니다.</p><p>ELVIA 문의 확인 페이지에서 이메일과 문의 비밀번호로 확인해 주세요.</p>${link ? `<p><a href="${link}">답변 확인하기</a></p>` : ''}`,
      }),
    });

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 500);
      await supabaseAdmin
        .from('email_outbox')
        .update({ status: 'FAILED', retry_count: row.retry_count + 1, last_error: detail })
        .eq('id', row.id);
      return false;
    }

    await supabaseAdmin
      .from('email_outbox')
      .update({ status: 'SENT', sent_at: new Date().toISOString(), last_error: null })
      .eq('id', row.id);
    return true;
  } catch (e) {
    console.error('[sendAnswerCompletedMail]', e);
    return false;
  }
}
