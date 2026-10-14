import 'server-only';

import bcrypt from 'bcryptjs';

import { supabaseAdmin } from '@/lib/supabase/admin';

import type { InquiryAccessResult, InquiryDetail } from './types';

const BUCKET = 'inquiry-attachments';
const SIGNED_URL_SECONDS = 600;

const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;

// 문의 한 건에 대한 비밀번호 대입 시도를 늦춘다.
// 서버 메모리에 저장하므로 인스턴스가 여러 개이거나 재시작되면 초기화된다. 완전한 방어가 아니라 1차 완화 장치다.
const failures = new Map<string, { count: number; lockedUntil: number }>();

// 문의가 없을 때도 같은 시간이 걸리도록 비교용 더미 해시를 쓴다. (존재 여부 추측 방지)
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password-1', 10);

export const ACCESS_DENIED_MESSAGE = '이름(또는 이메일) 또는 비밀번호가 일치하지 않습니다.';

function checkLocked(id: string) {
  const entry = failures.get(id);
  if (entry && entry.lockedUntil > Date.now()) return true;
  if (entry && entry.lockedUntil !== 0 && entry.lockedUntil <= Date.now()) failures.delete(id);
  return false;
}

function recordFailure(id: string) {
  const entry = failures.get(id) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_FAILURES) {
    entry.count = 0;
    entry.lockedUntil = Date.now() + LOCK_MS;
  }
  failures.set(id, entry);
}

export async function verifyInquiryAccess(
  id: string,
  nameOrEmail: string,
  password: string
): Promise<InquiryAccessResult> {
  if (checkLocked(id)) {
    return { ok: false, error: '확인 시도가 너무 많습니다. 15분 뒤에 다시 시도해 주세요.' };
  }

  const { data: row, error } = await supabaseAdmin
    .from('inquiries')
    .select(
      'id, inquiry_no, inquiry_type, title, customer_name, email_normalized, product_name_text, content, password_hash, status, created_at'
    )
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`문의 조회 실패: ${error.message}`);

  const who = nameOrEmail.trim();
  const passwordOk = await bcrypt.compare(password, row?.password_hash ?? DUMMY_HASH);
  const identityOk =
    row !== null && (who === row.customer_name || who.toLowerCase() === row.email_normalized);

  if (!row || !identityOk || !passwordOk) {
    recordFailure(id);
    return { ok: false, error: ACCESS_DENIED_MESSAGE };
  }
  failures.delete(id);

  const [{ data: files, error: filesError }, { data: answer, error: answerError }] =
    await Promise.all([
      supabaseAdmin
        .from('inquiry_attachments')
        .select('id, storage_path, original_name, file_size')
        .eq('inquiry_id', id)
        .order('created_at', { ascending: true }),
      // 임시 저장(DRAFT) 답변은 고객에게 보이지 않는다.
      supabaseAdmin
        .from('inquiry_answers')
        .select('content, submitted_at')
        .eq('inquiry_id', id)
        .eq('status', 'SUBMITTED')
        .maybeSingle(),
    ]);
  if (filesError) throw new Error(`첨부 조회 실패: ${filesError.message}`);
  if (answerError) throw new Error(`답변 조회 실패: ${answerError.message}`);

  const attachments: InquiryDetail['attachments'] = [];
  if (files && files.length > 0) {
    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrls(
        files.map((f) => f.storage_path),
        SIGNED_URL_SECONDS
      );
    if (signError) throw new Error(`첨부 링크 생성 실패: ${signError.message}`);

    files.forEach((f, i) => {
      const url = signed?.[i]?.signedUrl;
      if (url) {
        attachments.push({ id: f.id, name: f.original_name, size: Number(f.file_size), url });
      }
    });
  }

  return {
    ok: true,
    detail: {
      inquiryNo: row.inquiry_no,
      inquiryType: row.inquiry_type,
      title: row.title,
      productName: row.product_name_text,
      content: row.content,
      status: row.status,
      createdAt: row.created_at,
      attachments,
      answer:
        answer && answer.submitted_at
          ? { content: answer.content, submittedAt: answer.submitted_at }
          : null,
    },
  };
}
