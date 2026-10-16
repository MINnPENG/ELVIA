import 'server-only';

export type MailMessage = { to: string; subject: string; html: string };
export type SendMailResult = { ok: true } | { ok: false; error: string };

// 메일 발송 서비스는 Resend를 쓴다. 키는 서버 환경변수로만 읽고 브라우저에는 내보내지 않는다.
function getMailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  return apiKey && from ? { apiKey, from } : null;
}

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/** 메일 한 통을 보낸다. 실패해도 던지지 않고 결과만 돌려준다. (호출한 쪽의 본 작업을 막지 않기 위해) */
export async function sendMail({ to, subject, html }: MailMessage): Promise<SendMailResult> {
  const config = getMailConfig();
  if (!config) return { ok: false, error: 'RESEND_API_KEY / MAIL_FROM 이 설정되지 않았습니다.' };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: config.from, to: [to], subject, html }),
    });
    if (!response.ok) return { ok: false, error: (await response.text()).slice(0, 500) };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export function isMailConfigured() {
  return getMailConfig() !== null;
}
