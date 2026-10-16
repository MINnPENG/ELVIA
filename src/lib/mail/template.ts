import 'server-only';

import { escapeHtml } from './send';

type MailLayout = {
  label: string;
  heading: string;
  /** 안내 문구. 이미 이스케이프된 HTML이 아니라 일반 텍스트를 넘긴다. */
  body: string;
  rows?: [label: string, value: string][];
  button?: { text: string; href: string };
  footer: string;
};

// 메일 클라이언트는 CSS 지원이 제한적이라 table + 인라인 스타일로 쓴다. 색은 사이트(SubmittedCard)와 같은 값.
export function renderMailLayout({ label, heading, body, rows, button, footer }: MailLayout) {
  const rowsHtml = (rows ?? [])
    .map(
      ([name, value]) =>
        `<tr><td style="padding:14px 0;border-bottom:1px solid #EAECF0;font-size:14px;line-height:22px;color:#667085">${escapeHtml(name)}</td><td align="right" style="padding:14px 0;border-bottom:1px solid #EAECF0;font-size:16px;line-height:26px;color:#101828">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  const rowsBlock = rowsHtml
    ? `<tr><td style="padding:24px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EAECF0">${rowsHtml}</table></td></tr>`
    : '';

  const buttonBlock = button
    ? `<tr><td style="padding:28px 32px 0"><a href="${escapeHtml(button.href)}" style="display:inline-block;padding:14px 28px;border-radius:8px;background:#071A33;color:#FFFFFF;font-size:14px;line-height:20px;font-weight:700;text-decoration:none">${escapeHtml(button.text)}</a></td></tr>`
    : '';

  return `<!doctype html><html lang="ko"><body style="margin:0;padding:0;background:#F2F4F7">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F4F7;padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:12px;font-family:Pretendard,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;color:#101828">
<tr><td style="padding:28px 32px 0;font-size:18px;font-weight:700;letter-spacing:2px;color:#071A33">ELVIA</td></tr>
<tr><td style="padding:28px 32px 0;font-size:14px;line-height:20px;font-weight:700;color:#071A33">${escapeHtml(label)}</td></tr>
<tr><td style="padding:8px 32px 0;font-size:24px;line-height:34px;font-weight:700;color:#101828">${escapeHtml(heading)}</td></tr>
<tr><td style="padding:16px 32px 0;font-size:15px;line-height:26px;color:#667085">${escapeHtml(body)}</td></tr>
${rowsBlock}${buttonBlock}
<tr><td style="padding:24px 32px 32px;font-size:12px;line-height:18px;color:#98A2B3">${escapeHtml(footer)}</td></tr>
</table></td></tr></table></body></html>`;
}
