import 'server-only';

import { requireAdmin } from '@/lib/auth/require-admin';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { InquiryDetail } from '../inquiries/types';
import { loadInquiryDetail } from '../inquiries/access';

export type AdminInquiryDetail = {
  detail: InquiryDetail;
  draft: string | null;
};

export async function getAdminInquiryDetail(id: string): Promise<AdminInquiryDetail | null> {
  await requireAdmin();

  const [detail, draftResult] = await Promise.all([
    loadInquiryDetail(id),
    supabaseAdmin
      .from('inquiry_answers')
      .select('content')
      .eq('inquiry_id', id)
      .eq('status', 'DRAFT')
      .maybeSingle(),
  ]);

  if (draftResult.error) throw new Error(`임시 저장 답변 조회 실패: ${draftResult.error.message}`);
  if (!detail) return null;

  return {
    detail,
    draft: draftResult.data?.content ?? null,
  };
}
