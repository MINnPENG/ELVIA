import 'server-only';

import { deliverMail, enqueueMail, type BuildMessage } from '@/lib/mail/outbox';
import { escapeHtml } from '@/lib/mail/send';
import { supabaseAdmin } from '@/lib/supabase/admin';

import { formatDateTime } from './format';
import { INQUIRY_TYPE_LABEL, type InquiryType } from './types';

// 접수 확인 메일에는 접수 번호·문의 유형·작성자·접수 일시만 담는다. 제목·내용·비밀번호는 넣지 않는다.
const buildInquiryReceived: BuildMessage = async (inquiryId) => {
  const { data } = await supabaseAdmin
    .from('inquiries')
    .select('inquiry_no, inquiry_type, customer_name, created_at')
    .eq('id', inquiryId)
    .maybeSingle();
  if (!data) return null;

  const rows: [string, string][] = [
    ['접수 번호', data.inquiry_no],
    ['문의 유형', INQUIRY_TYPE_LABEL[data.inquiry_type as InquiryType] ?? data.inquiry_type],
    ['작성자', data.customer_name],
    ['접수 일시', formatDateTime(data.created_at)],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:14px 0;border-bottom:1px solid #EAECF0;font-size:14px;line-height:22px;color:#667085">${label}</td><td align="right" style="padding:14px 0;border-bottom:1px solid #EAECF0;font-size:16px;line-height:26px;color:#101828">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  // 메일 클라이언트는 CSS 지원이 제한적이라 table + 인라인 스타일로 쓴다. 색은 사이트(SubmittedCard)와 같은 값.
  const html = `<!doctype html><html lang="ko"><body style="margin:0;padding:0;background:#F2F4F7">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F4F7;padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:12px;font-family:Pretendard,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#101828">
<tr><td style="padding:28px 32px 0;font-size:18px;font-weight:700;letter-spacing:2px;color:#071A33">ELVIA</td></tr>
<tr><td style="padding:28px 32px 0;font-size:14px;line-height:20px;font-weight:700;color:#071A33">접수 완료</td></tr>
<tr><td style="padding:8px 32px 0;font-size:24px;line-height:34px;font-weight:700;color:#101828">문의가 정상적으로 접수되었습니다</td></tr>
<tr><td style="padding:16px 32px 0;font-size:15px;line-height:26px;color:#667085">${escapeHtml(data.customer_name)}님, 담당자가 문의 내용을 확인한 뒤 답변을 드립니다.답변이 등록되면 이 이메일로 다시 안내해 드립니다.</td></tr>
<tr><td style="padding:24px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EAECF0">${rowsHtml}</table></td></tr>
<tr><td style="padding:24px 32px 32px;font-size:12px;line-height:18px;color:#98A2B3">본 메일은 발신 전용입니다. 개인정보 보호를 위해 문의 제목, 내용, 비밀번호는 메일에 포함하지 않습니다.</td></tr>
</table></td></tr></table></body></html>`;

  return { subject: '[ELVIA] 문의가 접수되었습니다', html };
};

/** 접수 확인 메일을 outbox에 쌓는다. 쌓는 데 실패해도 접수는 유지해야 하므로 던지지 않는다. */
export function enqueueInquiryReceivedMail(inquiryId: string, email: string) {
  return enqueueMail(inquiryId, email, 'INQUIRY_RECEIVED');
}

export function sendInquiryReceivedMail(inquiryId: string) {
  return deliverMail(inquiryId, 'INQUIRY_RECEIVED', buildInquiryReceived);
}
