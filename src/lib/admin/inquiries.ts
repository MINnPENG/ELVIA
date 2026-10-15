import 'server-only';

import { requireAdmin } from '@/lib/auth/require-admin';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { InquiryDetail } from '../inquiries/types';
import { loadInquiryDetail } from '../inquiries/access';

export type AdminInquiryDetail = {
  detail: InquiryDetail;
  author: { name: string; email: string };
  draft: string | null;
};

export async function getAdminInquiryDetail(id: string): Promise<AdminInquiryDetail | null> {
  await requireAdmin();

  const [detail, authorResult, draftResult] = await Promise.all([
    loadInquiryDetail(id),
    supabaseAdmin.from('inquiries').select('customer_name, email').eq('id', id).maybeSingle(),
    supabaseAdmin
      .from('inquiry_answers')
      .select('content')
      .eq('inquiry_id', id)
      .eq('status', 'DRAFT')
      .maybeSingle(),
  ]);

  if (authorResult.error) throw new Error(`작성자 조회 실패: ${authorResult.error.message}`);
  if (draftResult.error) throw new Error(`임시 저장 답변 조회 실패: ${draftResult.error.message}`);
  if (!detail || !authorResult.data) return null;

  return {
    detail,
    author: { name: authorResult.data.customer_name, email: authorResult.data.email },
    draft: draftResult.data?.content ?? null,
  };
}
