import 'server-only';

import { createClient } from '@/lib/supabase/server';

export type AdminProduct = {
  id: string;
  name: string;
  model_name: string;
  category: 'DOOR_LOCK' | 'ACCESSORY';
  visibility: 'PUBLIC' | 'PRIVATE';
  price_amount: number | null;
  price_display_status: 'DISPLAY' | 'TBD' | 'HIDDEN';
  sort_order: number;
  updated_at: string;
  product_images: { id: string }[];
};

export async function getAdminProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, name, model_name, category, visibility, price_amount, price_display_status, sort_order, updated_at, product_images (id)'
    )
    .is('deleted_at', null)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`관리자 제품 목록 조회 실패: ${error.message}`);
  return data as unknown as AdminProduct[];
}
