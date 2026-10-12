'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth/require-admin';
import { createClient } from '@/lib/supabase/server';

export type ActionState = { error?: string; message?: string };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ImageRow = {
  id: string;
  is_primary: boolean;
  product_image_variants: { color_id: string | null }[];
};

async function findPublishProblem(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productId: string
) {
  const { data: images, error } = await supabase
    .from('product_images')
    .select('id, is_primary, product_image_variants (color_id)')
    .eq('product_id', productId);
  if (error) return '이미지 정보를 확인하지 못했습니다.';

  const list = (images ?? []) as unknown as ImageRow[];
  if (list.length < 1 || list.length > 5) return '공개하려면 이미지가 1~5장 필요합니다.';
  if (list.filter((i) => i.is_primary).length !== 1) {
    return '대표 이미지가 정확히 1장이어야 합니다.';
  }
  if (list.some((i) => i.product_image_variants.length === 0)) {
    return '파일이 없는 이미지 슬롯이 있습니다.';
  }

  // 색상별 이미지가 있는 슬롯은 모든 색상이 채워져야 한다. (공통 이미지가 있으면 통과)
  const { data: colors } = await supabase
    .from('product_colors')
    .select('id')
    .eq('product_id', productId);
  const colorIds = (colors ?? []).map((c: { id: string }) => c.id);
  for (const image of list) {
    const variants = image.product_image_variants;
    const hasCommon = variants.some((v) => v.color_id === null);
    if (hasCommon) continue;
    const covered = new Set(variants.map((v) => v.color_id));
    if (colorIds.some((id) => !covered.has(id))) return '색상별 이미지가 모두 등록되지 않았습니다.';
  }

  return null;
}

export async function setVisibility(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  const next = formData.get('visibility');
  if (!UUID_PATTERN.test(id) || (next !== 'PUBLIC' && next !== 'PRIVATE')) {
    return { error: '잘못된 요청입니다.' };
  }

  const supabase = await createClient();

  if (next === 'PUBLIC') {
    const problem = await findPublishProblem(supabase, id);
    if (problem) return { error: problem };
  }

  const { data, error } = await supabase
    .from('products')
    .update({ visibility: next })
    .eq('id', id)
    .is('deleted_at', null)
    .select('id');
  if (error || !data?.length) return { error: '공개 상태를 바꾸지 못했습니다.' };

  revalidatePath('/admin/products');
  return { message: next === 'PUBLIC' ? '공개로 전환했습니다.' : '비공개로 전환했습니다.' };
}

export async function softDeleteProduct(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  if (!UUID_PATTERN.test(id)) return { error: '잘못된 요청입니다.' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString(), visibility: 'PRIVATE' })
    .eq('id', id)
    .is('deleted_at', null)
    .select('id');
  if (error || !data?.length) return { error: '제품을 삭제하지 못했습니다.' };

  revalidatePath('/admin/products');
  return { message: '삭제했습니다.' };
}
