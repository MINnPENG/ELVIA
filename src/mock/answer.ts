export type AnswerActionResult = { ok: true; mailSent?: boolean } | { ok: false; error: string };

type AnswerInput = { inquiryId: string; content: string };

const FALLBACK_ERROR = '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

// 로딩 상태를 눈으로 확인할 수 있게 일부러 지연
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function validate(content: string) {
  const trimmed = content.trim();
  if (!trimmed) return '답변을 입력해 주세요.';
  return null;
}

// 같은 문의를 두 번 등록하면 거부되는지 확인하기 위한 모의 기록 (새로고침하면 초기화)
const mockSubmitted = new Set<string>();

/**
 * 임시 저장. 문의 상태는 바꾸지 않고 메일도 보내지 않는다.
 * TODO: API 나오면 아래 목 코드 대신 실제 호출로 교체
 */
export async function saveAnswerDraft({
  inquiryId,
  content,
}: AnswerInput): Promise<AnswerActionResult> {
  const error = validate(content);
  if (error) return { ok: false, error };

  await wait(600);

  if (mockSubmitted.has(inquiryId)) {
    return { ok: false, error: '이미 답변이 등록된 문의입니다. 등록된 답변은 수정할 수 없습니다.' };
  }

  console.log('[모의] 임시 저장 — 메일 발송 없음', inquiryId, content.trim());
  return { ok: true };
}

/**
 * 답변 등록. 답변 저장 + 상태 '답변 완료' 변경 + 고객 메일 발송.
 * TODO: API 나오면 아래 목 코드 대신 실제 호출로 교체
 */
export async function submitAnswer({
  inquiryId,
  content,
}: AnswerInput): Promise<AnswerActionResult> {
  const error = validate(content);
  if (error) return { ok: false, error };

  await wait(800);

  // 테스트용: 답변에 "#실패"를 넣으면 등록 실패
  if (content.includes('#실패')) return { ok: false, error: FALLBACK_ERROR };

  if (mockSubmitted.has(inquiryId)) {
    return { ok: false, error: '이미 답변이 등록된 문의입니다. 등록된 답변은 수정할 수 없습니다.' };
  }
  mockSubmitted.add(inquiryId);

  // 테스트용: 답변에 "#메일실패"를 넣으면 등록은 되고 메일만 실패
  const mailSent = !content.includes('#메일실패');
  console.log(mailSent ? '[모의] 답변 등록 + 메일 발송' : '[모의] 답변 등록, 메일 실패', inquiryId);

  return { ok: true, mailSent };
}
