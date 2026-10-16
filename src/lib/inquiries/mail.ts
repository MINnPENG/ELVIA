import 'server-only';

import { deliverMail, enqueueMail, type BuildMessage } from '@/lib/mail/outbox';
import { renderMailLayout } from '@/lib/mail/template';
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

  return {
    subject: '[ELVIA] 문의가 접수되었습니다',
    html: renderMailLayout({
      label: '접수 완료',
      heading: '문의가 정상적으로 접수되었습니다',
      body: `${data.customer_name}님, 담당자가 문의 내용을 확인한 뒤 답변을 드립니다. 답변이 등록되면 이 이메일로 다시 안내해 드립니다.`,
      rows,
      footer:
        '본 메일은 발신 전용입니다. 개인정보 보호를 위해 문의 제목, 내용, 비밀번호는 메일에 포함하지 않습니다.',
    }),
  };
};

/** 접수 확인 메일을 outbox에 쌓는다. 쌓는 데 실패해도 접수는 유지해야 하므로 던지지 않는다. */
export function enqueueInquiryReceivedMail(inquiryId: string, email: string) {
  return enqueueMail(inquiryId, email, 'INQUIRY_RECEIVED');
}

export function sendInquiryReceivedMail(inquiryId: string) {
  return deliverMail(inquiryId, 'INQUIRY_RECEIVED', buildInquiryReceived);
}
