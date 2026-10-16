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

  const table = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#667085">${label}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  return {
    subject: `[ELVIA] 문의가 접수되었습니다 (${data.inquiry_no})`,
    html: `<p>${escapeHtml(data.customer_name)}님, 문의가 정상적으로 접수되었습니다.</p><table>${table}</table><p>답변이 등록되면 이메일로 다시 안내해 드립니다.</p>`,
  };
};

/** 접수 확인 메일을 outbox에 쌓는다. 쌓는 데 실패해도 접수는 유지해야 하므로 던지지 않는다. */
export function enqueueInquiryReceivedMail(inquiryId: string, email: string) {
  return enqueueMail(inquiryId, email, 'INQUIRY_RECEIVED');
}

export function sendInquiryReceivedMail(inquiryId: string) {
  return deliverMail(inquiryId, 'INQUIRY_RECEIVED', buildInquiryReceived);
}
