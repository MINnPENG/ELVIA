/**
 * ELVIA 고객 문의 목데이터
 * - ERD 테이블 구조(snake_case)를 그대로 따름: customer_inquiries, inquiry_attachments
 * - 제품 참조는 product.ts의 products에서 model_name으로 찾아 ID를 맞춤
 * - 첨부파일은 product.ts의 FileRecord 구조를 그대로 사용 (files 테이블 공유 가정)
 * - 조회 인증 테스트: 모든 문의의 비밀번호는 평문 "1234" (password_hash는 목 전용 문자열)
 */

import { ADMIN_ID, products, type FileRecord, type Product } from './product';

// ─────────────────────────────────────────────
// 타입
// ─────────────────────────────────────────────
export type InquiryType = 'REPAIR' | 'PURCHASE' | 'PRODUCT';
export type InquiryStatus = 'WAITING' | 'ANSWERED';

export type CustomerInquiry = {
  id: string;
  inquiry_no: string; // UK
  inquiry_type: InquiryType;
  title: string;
  customer_name: string; // 이름/업체명
  email: string;
  phone: string | null;
  product_id: string | null; // FK → products.id
  product_name_text: string | null; // 작성 시점 제품명 스냅샷 또는 자유 입력
  content: string;
  password_hash: string;
  privacy_consent_at: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
};

export type InquiryAttachment = {
  id: string;
  inquiry_id: string; // FK → customer_inquiries.id
  file_id: string; // FK → files.id
  display_order: number;
};

export type AnswerStatus = 'DRAFT' | 'SUBMITTED';

export type InquiryAnswer = {
  id: string;
  inquiry_id: string; // FK, UK — 문의당 답변 1개 (임시 저장도 같은 행을 갱신)
  admin_id: string; // FK → admins.id
  content: string;
  status: AnswerStatus;
  saved_at: string; // 마지막 저장 시각 (임시 저장 포함)
  submitted_at: string | null; // DRAFT면 null
  updated_at: string;
};

// ─────────────────────────────────────────────
// 라벨
// ─────────────────────────────────────────────
export const INQUIRY_TYPE_LABEL: Record<InquiryType, string> = {
  REPAIR: '수리 문의',
  PURCHASE: '구매 문의',
  PRODUCT: '제품 문의',
};

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  WAITING: '답변 대기',
  ANSWERED: '답변 완료',
};

// ─────────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────────
const uid = (prefix: string, n: number) =>
  `${prefix}0000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

export const MOCK_PASSWORD = '1234';
const MOCK_HASH = `mock$${MOCK_PASSWORD}`;

/** 목데이터 전용 비밀번호 비교 — 실제 구현에서는 bcrypt.compare 등으로 교체 */
export const verifyMockPassword = (input: string, hash: string) => hash === `mock$${input}`;

/** product.ts의 제품을 모델명으로 찾음 (삭제·비공개 제품 포함) */
const productByModel = (model: string): Product => {
  const product = products.find((p) => p.model_name === model);
  if (!product) throw new Error(`목데이터에 없는 모델명: ${model}`);
  return product;
};

/** 제품 연결 + 이름 스냅샷 */
const linkProduct = (model: string) => {
  const p = productByModel(model);
  return { product_id: p.id, product_name_text: p.name };
};

const noProduct = (freeText: string | null = null) => ({
  product_id: null,
  product_name_text: freeText,
});

// ─────────────────────────────────────────────
// 문의
// ─────────────────────────────────────────────
const Q = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [i + 1, uid('e', i + 1)])
) as Record<number, string>;

export const customerInquiries: CustomerInquiry[] = [
  {
    id: Q[1],
    inquiry_no: 'INQ-20260914-0001',
    inquiry_type: 'PURCHASE',
    title: '오피스텔 단지 일괄 설치 견적 문의',
    customer_name: '(주)한빛건설',
    email: 'purchase@hanbit-const.co.kr',
    phone: '02-555-1234',
    ...linkProduct('ER-10N'),
    content:
      '신축 오피스텔 120세대에 ER-10N 일괄 설치를 검토 중입니다.\n대량 구매 단가와 설치 일정, A/S 조건을 안내받고 싶습니다. 현장 도면 첨부합니다.',
    password_hash: MOCK_HASH,
    privacy_consent_at: '2026-09-14T10:12:30+09:00',
    status: 'ANSWERED',
    created_at: '2026-09-14T10:12:31+09:00',
    updated_at: '2026-09-15T14:40:00+09:00',
  },
  {
    id: Q[2],
    inquiry_no: 'INQ-20260916-0002',
    inquiry_type: 'REPAIR',
    title: '비밀번호 입력 시 경고음만 나고 열리지 않아요',
    customer_name: '김민준',
    email: 'minjun.kim@gmail.com',
    phone: '010-2345-6789',
    ...linkProduct('ER-20F'),
    content:
      '어제부터 비밀번호를 정확히 입력해도 경고음만 나고 열리지 않습니다.\n지문으로는 정상적으로 열리고, 배터리는 지난달에 교체했습니다. 영상 첨부합니다.',
    password_hash: MOCK_HASH,
    privacy_consent_at: '2026-09-16T21:03:10+09:00',
    status: 'ANSWERED',
    created_at: '2026-09-16T21:03:11+09:00',
    updated_at: '2026-09-17T09:25:00+09:00',
  },
  {
    id: Q[3],
    inquiry_no: 'INQ-20260918-0003',
    inquiry_type: 'PRODUCT',
    title: '방화문에도 무타공 설치가 가능한가요?',
    customer_name: '이서연',
    email: 'seoyeon.lee@naver.com',
    phone: null,
    ...linkProduct('ER-30C'),
    content:
      '전세로 살고 있어 문에 구멍을 내기 어렵습니다.\n현재 방화문(두께 약 50mm)인데 ER-30C를 무타공으로 설치할 수 있을까요? 문 사진 첨부합니다.',
    password_hash: MOCK_HASH,
    privacy_consent_at: '2026-09-18T13:45:02+09:00',
    status: 'ANSWERED',
    created_at: '2026-09-18T13:45:03+09:00',
    updated_at: '2026-09-18T17:10:00+09:00',
  },
  {
    id: Q[4],
    inquiry_no: 'INQ-20260920-0004',
    inquiry_type: 'PURCHASE',
    title: '스티커형 카드키 추가 구매 방법',
    customer_name: '박지훈',
    email: 'jihoon.park@kakao.com',
    phone: '010-8765-4321',
    ...linkProduct('EC-01'),
    content:
      'ER-30C를 사용 중인데 가족용으로 EC-01을 3장 더 사고 싶습니다.\n온라인 판매는 하지 않는 것 같은데 어디서 구매할 수 있나요?',
    password_hash: MOCK_HASH,
    privacy_consent_at: '2026-09-20T09:20:44+09:00',
    status: 'ANSWERED',
    created_at: '2026-09-20T09:20:45+09:00',
    updated_at: '2026-09-21T11:05:00+09:00',
  },
  {
    id: Q[5],
    inquiry_no: 'INQ-20260923-0005',
    inquiry_type: 'REPAIR',
    title: '고온경보가 계속 울립니다',
    customer_name: '최유진',
    email: 'yujin.choi@daum.net',
    phone: '010-3456-7890',
    ...linkProduct('ER-20F'),
    content:
      '화재 상황이 아닌데도 오후 시간대에 고온경보가 반복해서 울립니다.\n현관이 서향이라 햇빛이 직접 닿는데 그 영향인지 궁금합니다.',
    password_hash: MOCK_HASH,
    privacy_consent_at: '2026-09-23T16:30:18+09:00',
    status: 'ANSWERED',
    created_at: '2026-09-23T16:30:19+09:00',
    updated_at: '2026-09-24T10:00:00+09:00',
  },
  {
    id: Q[6],
    inquiry_no: 'INQ-20260926-0006',
    inquiry_type: 'PRODUCT',
    title: '허수 기능 사용 방법이 궁금합니다',
    customer_name: '정하늘',
    email: 'haneul.jung@gmail.com',
    phone: null,
    ...noProduct('모델명 모름 (작년에 설치)'),
    content:
      '비밀번호 앞뒤로 아무 숫자나 눌러도 된다고 들었는데,\n제 도어락에서도 되는지와 정확한 사용법을 알고 싶습니다.',
    password_hash: MOCK_HASH,
    privacy_consent_at: '2026-09-26T22:11:05+09:00',
    status: 'ANSWERED',
    created_at: '2026-09-26T22:11:06+09:00',
    updated_at: '2026-09-28T09:40:00+09:00',
  },
  {
    id: Q[7],
    inquiry_no: 'INQ-20260929-0007',
    inquiry_type: 'PURCHASE',
    title: '사무실용 도어락 추천 부탁드립니다',
    customer_name: '스튜디오 오름',
    email: 'contact@studio-orum.kr',
    phone: '070-4123-5678',
    ...noProduct(),
    content:
      '직원 15명 규모 사무실입니다.\n지문과 카드키를 같이 쓸 수 있는 모델이 있는지, 등록 가능한 인원이 몇 명인지 궁금합니다.',
    password_hash: MOCK_HASH,
    privacy_consent_at: '2026-09-29T11:02:40+09:00',
    status: 'ANSWERED',
    created_at: '2026-09-29T11:02:41+09:00',
    updated_at: '2026-09-30T15:20:00+09:00',
  },
  {
    id: Q[8],
    inquiry_no: 'INQ-20261002-0008',
    inquiry_type: 'REPAIR',
    title: 'LED가 빨간색으로 깜빡이고 잠기지 않아요',
    customer_name: '강도윤',
    email: 'doyoon.kang@naver.com',
    phone: '010-5678-1234',
    ...linkProduct('ER-30C'),
    content:
      '문을 닫은 뒤 LED가 빨간색으로 계속 깜빡이고 바로잠김이 되지 않습니다.\n사진 두 장 첨부합니다.',
    password_hash: MOCK_HASH,
    privacy_consent_at: '2026-10-02T08:47:21+09:00',
    status: 'WAITING',
    created_at: '2026-10-02T08:47:22+09:00',
    updated_at: '2026-10-02T08:47:22+09:00',
  },
  {
    id: Q[9],
    inquiry_no: 'INQ-20261005-0009',
    inquiry_type: 'PRODUCT',
    title: '레드 색상 실물 색감 문의',
    customer_name: '윤서아',
    email: 'seoa.yoon@gmail.com',
    phone: null,
    ...linkProduct('ER-10N'),
    content:
      'ER-10N 레드와 블랙 중 고민 중입니다.\n레드가 사이트 사진보다 실물이 더 어두운 편인지 알려주실 수 있을까요?',
    password_hash: MOCK_HASH,
    privacy_consent_at: '2026-10-05T19:15:33+09:00',
    status: 'WAITING',
    created_at: '2026-10-05T19:15:34+09:00',
    updated_at: '2026-10-05T19:15:34+09:00',
  },
  {
    // 엣지 케이스: 단종(DELETED) 제품에 대한 문의 — product_id는 남아 있지만 상세 페이지는 404
    id: Q[10],
    inquiry_no: 'INQ-20261007-0010',
    inquiry_type: 'REPAIR',
    title: '단종된 모델인데 수리가 가능한가요?',
    customer_name: '임재원',
    email: 'jaewon.lim@kakao.com',
    phone: '010-9012-3456',
    ...linkProduct('ER-05N'),
    content:
      '5년 전에 설치한 ER-05N의 건전지 덮개가 부러졌습니다.\n단종됐다고 들었는데 부품 교체나 수리가 가능한지 궁금합니다.',
    password_hash: MOCK_HASH,
    privacy_consent_at: '2026-10-07T07:58:09+09:00',
    status: 'WAITING',
    created_at: '2026-10-07T07:58:10+09:00',
    updated_at: '2026-10-07T07:58:10+09:00',
  },
  {
    // 엣지 케이스: 제품을 선택하지 않고 이름만 직접 입력
    id: Q[11],
    inquiry_no: 'INQ-20261008-0011',
    inquiry_type: 'PURCHASE',
    title: '부산 지역 대리점 위치 문의',
    customer_name: '한예린',
    email: 'yerin.han@naver.com',
    phone: '010-1111-2222',
    ...noProduct('ER-30C'),
    content: '부산 해운대 근처에서 실물을 보고 구매할 수 있는 대리점이 있는지 궁금합니다.',
    password_hash: MOCK_HASH,
    privacy_consent_at: '2026-10-08T14:22:57+09:00',
    status: 'WAITING',
    created_at: '2026-10-08T14:22:58+09:00',
    updated_at: '2026-10-08T14:22:58+09:00',
  },
  {
    id: Q[12],
    inquiry_no: 'INQ-20261009-0012',
    inquiry_type: 'PRODUCT',
    title: '사용 설명서 PDF가 열리지 않아요',
    customer_name: '오준서',
    email: 'junseo.oh@gmail.com',
    phone: null,
    ...linkProduct('ER-30C'),
    content:
      '제품 상세 페이지에서 사용 매뉴얼을 다운로드했는데 파일이 열리지 않습니다.\n다른 경로로 받을 수 있을까요?',
    password_hash: MOCK_HASH,
    privacy_consent_at: '2026-10-09T23:41:12+09:00',
    status: 'WAITING',
    created_at: '2026-10-09T23:41:13+09:00',
    updated_at: '2026-10-09T23:41:13+09:00',
  },
];

// ─────────────────────────────────────────────
// 첨부파일 (files ID는 product.ts와 겹치지 않게 101번부터)
// ─────────────────────────────────────────────
export const inquiryFiles: FileRecord[] = [];
export const inquiryAttachments: InquiryAttachment[] = [];

let fileSeq = 100;
let attachmentSeq = 0;

function addAttachment(
  inquiryId: string,
  path: string,
  originalName: string,
  mime: string,
  size: number,
  order: number
) {
  const file: FileRecord = {
    id: uid('f', ++fileSeq),
    storage_path: path,
    url: `/mock/${path}`,
    original_name: originalName,
    mime_type: mime,
    size_bytes: size,
    created_at: customerInquiries.find((q) => q.id === inquiryId)!.created_at,
  };
  inquiryFiles.push(file);
  inquiryAttachments.push({
    id: uid('9', ++attachmentSeq),
    inquiry_id: inquiryId,
    file_id: file.id,
    display_order: order,
  });
}

addAttachment(
  Q[1],
  'inquiries/0001/site-plan.pdf',
  '현장_도면.pdf',
  'application/pdf',
  1_204_224,
  1
);
addAttachment(Q[2], 'inquiries/0002/error.mp4', '도어락_오류_영상.mp4', 'video/mp4', 8_421_376, 1);
addAttachment(Q[3], 'inquiries/0003/fire-door.jpg', '방화문_사진.jpg', 'image/jpeg', 512_000, 1);
addAttachment(Q[8], 'inquiries/0008/led-1.jpg', 'LED_깜빡임_1.jpg', 'image/jpeg', 487_312, 1);
addAttachment(Q[8], 'inquiries/0008/led-2.jpg', 'LED_깜빡임_2.jpg', 'image/jpeg', 503_840, 2);

// ─────────────────────────────────────────────
// 답변
// - ANSWERED 문의 7건 → SUBMITTED 답변 (submitted_at = 문의 updated_at)
// - WAITING 문의 중 8번·10번 → DRAFT 답변 (관리자 임시 저장 불러오기 테스트용)
// - 나머지 WAITING 문의(9·11·12번)는 답변 행 없음
// ─────────────────────────────────────────────
let answerSeq = 0;

function submitted(inquiryId: string, content: string, savedAt: string): InquiryAnswer {
  const submittedAt = customerInquiries.find((q) => q.id === inquiryId)!.updated_at;
  return {
    id: uid('7', ++answerSeq),
    inquiry_id: inquiryId,
    admin_id: ADMIN_ID,
    content,
    status: 'SUBMITTED',
    saved_at: savedAt,
    submitted_at: submittedAt,
    updated_at: submittedAt,
  };
}

function draft(inquiryId: string, content: string, savedAt: string): InquiryAnswer {
  return {
    id: uid('7', ++answerSeq),
    inquiry_id: inquiryId,
    admin_id: ADMIN_ID,
    content,
    status: 'DRAFT',
    saved_at: savedAt,
    submitted_at: null,
    updated_at: savedAt,
  };
}

export const inquiryAnswers: InquiryAnswer[] = [
  submitted(
    Q[1],
    '안녕하세요, ELVIA입니다.\n\nER-10N 120세대 일괄 설치 문의 감사드립니다. 보내주신 도면 기준으로 설치 가능 여부를 확인했으며, 전 세대 표준 설치가 가능합니다.\n\n대량 구매 단가와 설치 일정은 담당 영업 매니저가 영업일 기준 2일 이내에 대표 이메일로 견적서를 보내드릴 예정입니다. 단체 설치 건은 설치일로부터 2년간 무상 A/S가 적용됩니다.\n\n감사합니다.',
    '2026-09-15T14:20:00+09:00'
  ),
  submitted(
    Q[2],
    '안녕하세요, ELVIA입니다.\n\n지문은 정상이고 비밀번호만 인식되지 않는 경우, 키패드 접점 이상이거나 비밀번호가 변경되었을 가능성이 있습니다.\n\n1. 실내 배터리 커버 안쪽의 등록 버튼을 눌러 비밀번호를 다시 등록해 주세요.\n2. 재등록 후에도 같은 증상이 있으면 키패드 점검이 필요합니다.\n\n보내주신 영상으로 보아 키패드 점검이 필요할 가능성이 높아, A/S 접수를 도와드리겠습니다. 고객센터로 연락 주시면 방문 일정을 잡아드리겠습니다.\n\n감사합니다.',
    '2026-09-17T09:10:00+09:00'
  ),
  submitted(
    Q[3],
    '안녕하세요, ELVIA입니다.\n\nER-30C는 문 두께 40~60mm 범위에서 무타공 설치가 가능하며, 보내주신 방화문(약 50mm)에도 설치하실 수 있습니다.\n\n다만 사진상 기존 보조키 자리가 있어, 설치 시 해당 자리를 활용하는 방식으로 진행됩니다. 이사하실 때 제거해도 문에 흔적이 거의 남지 않습니다.\n\n감사합니다.',
    '2026-09-18T16:55:00+09:00'
  ),
  submitted(
    Q[4],
    '안녕하세요, ELVIA입니다.\n\nEC-01은 ER-30C와 호환되며, 현재 온라인 판매는 하지 않고 있습니다.\n가까운 공식 대리점이나 고객센터 전화 주문으로 구매하실 수 있습니다.\n\n구매 후에는 사용설명서의 카드키 등록 방법에 따라 도어락에 등록해 주세요.\n\n감사합니다.',
    '2026-09-21T10:50:00+09:00'
  ),
  submitted(
    Q[5],
    '안녕하세요, ELVIA입니다.\n\nER-20F의 고온경보는 도어락 내부 온도가 일정 수준 이상 올라가면 작동합니다. 서향 현관에 직사광선이 오래 닿으면 화재가 아니어도 경보가 울릴 수 있습니다.\n\n현관에 차양을 설치하시거나, 증상이 계속되면 온도 센서 점검을 위해 A/S 접수해 주세요. 점검은 보증 기간 내 무상으로 진행됩니다.\n\n감사합니다.',
    '2026-09-24T09:45:00+09:00'
  ),
  submitted(
    Q[6],
    '안녕하세요, ELVIA입니다.\n\n허수 기능은 실제 비밀번호 앞뒤로 임의의 숫자를 함께 눌러도 문이 열리는 기능으로, 비밀번호 노출을 막아줍니다.\n현재 판매 중인 모델 중에서는 ER-10N과 ER-20F가 지원합니다.\n\n모델명은 도어락 실내 몸체 배터리 커버 안쪽 라벨에서 확인하실 수 있습니다. 모델명을 알려주시면 정확한 사용법을 안내해 드리겠습니다.\n\n감사합니다.',
    '2026-09-28T09:30:00+09:00'
  ),
  submitted(
    Q[7],
    '안녕하세요, ELVIA입니다.\n\n지문과 비밀번호를 함께 쓰시려면 ER-20F, 카드키와 비밀번호를 함께 쓰시려면 ER-30C를 추천드립니다.\n지문과 카드키를 동시에 지원하는 모델은 현재 준비 중입니다.\n\n15명 규모 사무실이라면 인원별로 카드키를 나눠 쓸 수 있는 ER-30C가 관리하기 편합니다. 등록 가능 인원 등 자세한 사양은 상담을 통해 안내해 드리겠습니다.\n\n감사합니다.',
    '2026-09-30T15:00:00+09:00'
  ),

  // ── 임시 저장 (DRAFT) ──
  draft(
    Q[8],
    '안녕하세요, ELVIA입니다.\n\nLED가 빨간색으로 깜빡이는 것은 문이 완전히 닫히지 않았거나 걸쇠가 걸리지 않았다는 표시입니다.\n\n보내주신 사진을 보면',
    '2026-10-02T17:30:00+09:00'
  ),
  draft(
    Q[10],
    '안녕하세요, ELVIA입니다.\n\nER-05N은 단종되었지만 부품 보유 기간 내에 있어 건전지 덮개 교체가 가능합니다.',
    '2026-10-08T10:15:00+09:00'
  ),
];

// ─────────────────────────────────────────────
// 화면용 타입 + 헬퍼
// ─────────────────────────────────────────────

/** 목록 화면용 — 비밀번호·연락처 등 민감 정보 제외 */
export type InquiryListItem = Pick<
  CustomerInquiry,
  'id' | 'inquiry_no' | 'inquiry_type' | 'title' | 'customer_name' | 'status' | 'created_at'
>;

export type InquiryDetail = Omit<CustomerInquiry, 'password_hash'> & {
  attachments: (InquiryAttachment & { file: FileRecord })[];
  answer: InquiryAnswer | null;
};

export type InquiryFilter = {
  type?: InquiryType;
  status?: InquiryStatus;
  keyword?: string; // 제목 또는 문의 번호
  page?: number;
  pageSize?: number;
};

/** 문의 목록 — 최신순, 필터·검색·페이지네이션 */
export function getInquiries({
  type,
  status,
  keyword,
  page = 1,
  pageSize = 10,
}: InquiryFilter = {}) {
  const kw = keyword?.trim().toLowerCase();
  const filtered = customerInquiries
    .filter((q) => !type || q.inquiry_type === type)
    .filter((q) => !status || q.status === status)
    .filter(
      (q) => !kw || q.title.toLowerCase().includes(kw) || q.inquiry_no.toLowerCase().includes(kw)
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const items: InquiryListItem[] = filtered
    .slice((page - 1) * pageSize, page * pageSize)
    .map(({ id, inquiry_no, inquiry_type, title, customer_name, status, created_at }) => ({
      id,
      inquiry_no,
      inquiry_type,
      title,
      customer_name,
      status,
      created_at,
    }));

  return {
    items,
    total: filtered.length,
    page,
    totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
  };
}

/**
 * 문의 상세
 * - includeDraft: true → 관리자 화면 (임시 저장 답변까지 반환, 답변 인풋에 불러오기)
 * - includeDraft: false → 사용자 화면 (등록 완료된 답변만 반환)
 */
export function getInquiryDetail(
  id: string,
  { includeDraft = false }: { includeDraft?: boolean } = {}
): InquiryDetail | null {
  const inquiry = customerInquiries.find((q) => q.id === id);
  if (!inquiry) return null;

  const { password_hash: _omit, ...rest } = inquiry;
  const attachments = inquiryAttachments
    .filter((a) => a.inquiry_id === id)
    .sort((a, b) => a.display_order - b.display_order)
    .map((a) => ({ ...a, file: inquiryFiles.find((f) => f.id === a.file_id)! }));

  const answer = inquiryAnswers.find((a) => a.inquiry_id === id) ?? null;
  const visibleAnswer = answer && (includeDraft || answer.status === 'SUBMITTED') ? answer : null;

  return { ...rest, attachments, answer: visibleAnswer };
}

/** 관리자 문의 상세 */
export const getAdminInquiryDetail = (id: string) => getInquiryDetail(id, { includeDraft: true });

/**
 * 사용자 조회 인증 — 이름 또는 이메일 + 비밀번호가 맞을 때만 상세 반환
 * 실패 시 null → 모달에서 빨간 테두리 + 설명 문구 처리
 */
export function verifyInquiryAccess(
  id: string,
  nameOrEmail: string,
  password: string
): InquiryDetail | null {
  const inquiry = customerInquiries.find((q) => q.id === id);
  if (!inquiry) return null;

  const who = nameOrEmail.trim();
  const identityOk = who === inquiry.customer_name || who.toLowerCase() === inquiry.email;
  return identityOk && verifyMockPassword(password, inquiry.password_hash)
    ? getInquiryDetail(id)
    : null;
}
