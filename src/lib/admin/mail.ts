import 'server-only';

import { deliverMail, type BuildMessage } from '@/lib/mail/outbox';
import { renderMailLayout } from '@/lib/mail/template';
import { supabaseAdmin } from '@/lib/supabase/admin';

// 문의 제목·내용·답변은 메일에 담지 않는다. 사이트에서 본인 확인(이메일, 문의 비밀번호) 후 보게 한다.
const buildAnswerCompleted: BuildMessage = async (inquiryId) => {
  const { data: inquiry } = await supabaseAdmin
    .from('inquiries')
    .select('customer_name')
    .eq('id', inquiryId)
    .maybeSingle();
  if (!inquiry) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  // 링크 없는 안내 메일은 쓸모가 없으므로 보내지 않고 FAILED로 남긴다.
  if (!siteUrl) throw new Error('NEXT_PUBLIC_SITE_URL 이 설정되지 않았습니다.');

  return {
    subject: '[ELVIA] 문의하신 내용에 답변이 등록되었습니다',
    html: renderMailLayout({
      label: '답변 완료',
      heading: '문의하신 내용에 답변이 등록되었습니다',
      body: `${inquiry.customer_name}님, 아래 버튼을 눌러 문의 확인 페이지에서 이메일과 문의 비밀번호로 답변을 확인해 주세요.`,
      button: { text: '답변 확인하기', href: `${siteUrl}/inquiry-list` },
      footer:
        '본 메일은 발신 전용입니다. 개인정보 보호를 위해 문의 내용과 답변은 메일에 포함하지 않습니다.',
    }),
  };
};

/**
 * 답변 등록 시 DB 함수가 email_outbox에 쌓아 둔 "답변 완료" 메일을 보낸다.
 * 답변 등록 자체는 이미 끝난 상태이므로, 실패해도 던지지 않고 false를 돌려준다.
 */
export function sendAnswerCompletedMail(inquiryId: string): Promise<boolean> {
  return deliverMail(inquiryId, 'ANSWER_COMPLETED', buildAnswerCompleted);
}
