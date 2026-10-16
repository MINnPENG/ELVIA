import 'server-only';

import { createClient } from '@/lib/supabase/server';
import type { AdminProductFilters } from './productFilter';
import { pickUrl, publicUrl } from '../products/queries';

export const ADMIN_PRODUCT_PAGE_SIZE = 6;

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
  thumbnail_url: string | null;
};

type AdminProductRow = Omit<AdminProduct, 'thumbnail_url'> & {
  product_images: {
    display_order: number;
    is_primary: boolean;
    product_image_variants: { color_id: string | null; storage_path: string }[];
  }[];
};

function pickThumbnail(images: AdminProductRow['product_images']) {
  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
  const image = sorted.find((img) => img.is_primary) ?? sorted[0];
  if (!image) return null;

  const variants = image.product_image_variants.map((v) => ({
    colorId: v.color_id,
    url: publicUrl(v.storage_path),
  }));

  return pickUrl(variants, null);
}

export async function getAdminProducts(filters: AdminProductFilters = { page: 1 }) {
  const supabase = await createClient();
  const from = (filters.page - 1) * ADMIN_PRODUCT_PAGE_SIZE;
  const to = from + ADMIN_PRODUCT_PAGE_SIZE - 1;

  let query = supabase
    .from('products')
    .select(
      `id, name, model_name, category, visibility, price_amount, price_display_status, sort_order, updated_at, product_images  (display_order, is_primary, product_image_variants (color_id, storage_path))`,
      { count: 'exact' }
    )
    .is('deleted_at', null);

  if (filters.category) query = query.eq('category', filters.category);
  if (filters.visibility) query = query.eq('visibility', filters.visibility);
  if (filters.search) {
    const safe = filters.search.replace(/[,()]/g, ' ').trim();
    if (safe) query = query.or(`name.ilike.%${safe}%,model_name.ilike.%${safe}%`);
  }

  const { data, error, count } = await query
    .order('sort_order', { ascending: true })
    .range(from, to);

  if (error) throw new Error(`관리자 제품 목록 조회 실패: ${error.message}`);
  return {
    products: (data as unknown as AdminProductRow[]).map(({ product_images, ...product }) => ({
      ...product,
      thumbnail_url: pickThumbnail(product_images),
    })),
    total: count ?? 0,
  };
}
