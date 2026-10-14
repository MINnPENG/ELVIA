import 'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';

import { INQUIRY_STATUSES, type InquiryListItem, type InquiryStatus } from './types';

export const INQUIRY_PAGE_SIZE = 10;

const LIST_COLUMNS = 'id, inquiry_no, inquiry_type, title, status, created_at';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: string | undefined): value is string =>
  Boolean(value && UUID_PATTERN.test(value));

export const parseStatus = (value: string | undefined): InquiryStatus | undefined =>
  INQUIRY_STATUSES.find((s) => s === value);

export const parsePage = (value: string | undefined) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
};

type ListParams = { status?: InquiryStatus; keyword?: string; page: number };

/** 공개 목록. anon 키로는 inquiries를 읽을 수 없으므로 서버에서 service key로 조회하고, 안전한 컬럼만 고른다. */
export async function getInquiryList({ status, keyword, page }: ListParams) {
  let query = supabaseAdmin.from('inquiries').select(LIST_COLUMNS, { count: 'exact' });

  if (status) query = query.eq('status', status);

  // PostgREST 필터 문법에 쓰이는 문자는 검색어에서 뺀다.
  const kw = keyword?.replace(/[%_,()"\\*]/g, ' ').trim();
  if (kw) query = query.or(`title.ilike.%${kw}%,inquiry_no.ilike.%${kw}%`);

  const from = (page - 1) * INQUIRY_PAGE_SIZE;
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, from + INQUIRY_PAGE_SIZE - 1);

  if (error) throw new Error(`문의 목록 조회 실패: ${error.message}`);

  const total = count ?? 0;
  return {
    items: (data ?? []) as InquiryListItem[],
    total,
    totalPages: Math.max(1, Math.ceil(total / INQUIRY_PAGE_SIZE)),
  };
}

/** 선택한 문의 한 건의 목록용 정보(제목·상태 등). 현재 페이지에 없는 항목도 열 수 있게 따로 조회한다. */
export async function getInquiryListItem(id: string) {
  const { data, error } = await supabaseAdmin
    .from('inquiries')
    .select(LIST_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`문의 조회 실패: ${error.message}`);
  return data as InquiryListItem | null;
}
