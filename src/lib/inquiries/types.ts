/** 실제 DB enum(inquiry_type, inquiry_status)과 같은 값. 서버·클라이언트 공용. */
export type InquiryType = 'PRODUCT_USAGE' | 'PURCHASE' | 'REPAIR' | 'OTHER';
export type InquiryStatus = 'WAITING' | 'COMPLETED';

export const INQUIRY_TYPE_LABEL: Record<InquiryType, string> = {
  PRODUCT_USAGE: '제품 사용 문의',
  PURCHASE: '구매 문의',
  REPAIR: '수리 문의',
  OTHER: '기타 문의',
};

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  WAITING: '답변 대기',
  COMPLETED: '답변 완료',
};

export const INQUIRY_STATUSES: InquiryStatus[] = ['WAITING', 'COMPLETED'];

/** 목록용: 공개해도 되는 값만. 문의 내용·이메일·이름·비밀번호 해시는 넣지 않는다. */
export type InquiryListItem = {
  id: string;
  inquiry_no: string;
  inquiry_type: InquiryType;
  title: string;
  status: InquiryStatus;
  created_at: string;
};

export type InquiryDetail = {
  inquiryNo: string;
  inquiryType: InquiryType;
  title: string;
  productName: string | null;
  content: string;
  status: InquiryStatus;
  createdAt: string;
  attachments: { id: string; name: string; size: number; url: string }[];
  answer: { content: string; submittedAt: string } | null;
};

export type InquiryAccessResult = { ok: true } | { ok: false; error: string };
