import 'server-only';

import { deliverMail, type BuildMessage } from '@/lib/mail/outbox';
import { escapeHtml } from '@/lib/mail/send';
import { supabaseAdmin } from '@/lib/supabase/admin';

const buildAnswerCompleted: BuildMessage = async (inquiryId) => {
  const { data: inquiry } = await supabaseAdmin
    .from('inquiries')
    .select('inquiry_no, title, customer_name')
    .eq('id', inquiryId)
    .maybeSingle();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  const link = siteUrl ? `${siteUrl}/inquiry-list/${inquiryId}` : null;

  return {
    subject: `[ELVIA] 문의하신 내용에 답변이 등록되었습니다${inquiry ? ` (${inquiry.inquiry_no})` : ''}`,
    // 문의 내용·답변은 메일에 담지 않는다. 본인 확인 후 사이트에서 보게 한다.
    html: `<p>${escapeHtml(inquiry?.customer_name ?? '고객')}님, 문의하신 「${escapeHtml(inquiry?.title ?? '문의')}」에 답변이 등록되었습니다.</p><p>ELVIA 문의 확인 페이지에서 이메일과 문의 비밀번호로 확인해 주세요.</p>${link ? `<p><a href="${link}">답변 확인하기</a></p>` : ''}`,
  };
};

/**
 * 답변 등록 시 DB 함수가 email_outbox에 쌓아 둔 "답변 완료" 메일을 보낸다.
 * 답변 등록 자체는 이미 끝난 상태이므로, 실패해도 던지지 않고 false를 돌려준다.
 */
export function sendAnswerCompletedMail(inquiryId: string): Promise<boolean> {
  return deliverMail(inquiryId, 'ANSWER_COMPLETED', buildAnswerCompleted);
}
