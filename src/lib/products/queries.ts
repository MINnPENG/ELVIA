import 'server-only';

import { cache } from 'react';

import { createClient } from '@/lib/supabase/server';

import { ACCESS_METHOD_LABELS, FEATURE_INFO } from './labels';
import type {
  AccessMethodCode,
  FeatureCode,
  ImageVariantView,
  PriceDisplayStatus,
  ProductCategory,
  ProductView,
} from './types';

const BUCKET = 'product-assets';
const ICON_BUCKET = 'feature-icons';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PRODUCT_SELECT = `
  id, name, model_name, category, price_amount, price_display_status,
  short_description, description,
  product_colors (id, color_name, color_code, is_default, display_order),
  product_images (
    id, display_order, is_primary,
    product_image_variants (color_id, storage_path)
  ),
  product_access_methods (access_method),
  product_features (feature_code),
  product_manuals (manuals (storage_path, original_name))
`;

type ManualRow = { storage_path: string; original_name: string };
type ManualLink = { manuals: ManualRow | ManualRow[] | null };

type ProductRow = {
  id: string;
  name: string;
  model_name: string;
  category: ProductCategory;
  price_amount: number | null;
  price_display_status: PriceDisplayStatus;
  short_description: string;
  description: string;
  product_colors: {
    id: string;
    color_name: string;
    color_code: string | null;
    is_default: boolean;
    display_order: number;
  }[];
  product_images: {
    id: string;
    display_order: number;
    is_primary: boolean;
    product_image_variants: { color_id: string | null; storage_path: string }[];
  }[];
  product_access_methods: { access_method: AccessMethodCode }[];
  product_features: { feature_code: FeatureCode }[];
  product_manuals: ManualLink | ManualLink[] | null;
};

export function publicUrl(path: string, bucket = BUCKET) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

type CatalogEntry = { name: string; description: string; icon: string | null; order: number };
type CatalogRow = {
  code: FeatureCode;
  name: string;
  description: string;
  icon_path: string | null;
  sort_order: number;
};

// 기능 이름, 설명, 아이콘은 DB(feature_catalog)에서 읽는다. 읽지 못하면 빈 맵을 돌려주고,
// toProductView 가 labels.ts 의 대체값을 쓰므로 제품 화면은 그대로 나온다.
const getFeatureCatalog = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('feature_catalog')
    .select('code, name, description, icon_path, sort_order');

  const catalog = new Map<FeatureCode, CatalogEntry>();
  if (error) {
    console.error('[getFeatureCatalog]', error.message);
    return catalog;
  }

  for (const row of (data ?? []) as CatalogRow[]) {
    catalog.set(row.code, {
      name: row.name,
      description: row.description,
      icon: row.icon_path ? publicUrl(row.icon_path, ICON_BUCKET) : null,
      order: row.sort_order,
    });
  }
  return catalog;
});

export function pickUrl(variants: ImageVariantView[], colorId: string | null) {
  const variant =
    variants.find((v) => v.colorId === colorId) ??
    variants.find((v) => v.colorId === null) ??
    variants[0];
  return variant?.url ?? null;
}

function first<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function toProductView(row: ProductRow, catalog: Map<FeatureCode, CatalogEntry>): ProductView {
  const colors = [...row.product_colors]
    .sort((a, b) => a.display_order - b.display_order)
    .map((c) => ({
      id: c.id,
      name: c.color_name,
      code: c.color_code,
      isDefault: c.is_default,
    }));

  const images = [...row.product_images]
    .sort((a, b) => a.display_order - b.display_order)
    .map((img) => ({
      id: img.id,
      order: img.display_order,
      isPrimary: img.is_primary,
      variants: img.product_image_variants.map((v) => ({
        colorId: v.color_id,
        url: publicUrl(v.storage_path),
      })),
    }));

  const defaultColorId = (colors.find((c) => c.isDefault) ?? colors[0])?.id ?? null;
  const primary = images.find((i) => i.isPrimary) ?? images[0];

  const accessOrder = Object.keys(ACCESS_METHOD_LABELS) as AccessMethodCode[];
  const featureOrder = Object.keys(FEATURE_INFO) as FeatureCode[];

  const accessMethods = row.product_access_methods
    .map((m) => m.access_method)
    .sort((a, b) => accessOrder.indexOf(a) - accessOrder.indexOf(b))
    .map((code) => ({ code, name: ACCESS_METHOD_LABELS[code] }));

  const features = row.product_features
    .map((f) => f.feature_code)
    // 순서는 DB(feature_catalog.sort_order)를 따르고, 카탈로그에 없는 코드는 코드 상수 순서로 뒤에 둔다.
    .sort(
      (a, b) =>
        (catalog.get(a)?.order ?? 1000 + featureOrder.indexOf(a)) -
        (catalog.get(b)?.order ?? 1000 + featureOrder.indexOf(b))
    )
    .map((code) => {
      const fallback = FEATURE_INFO[code];
      const entry = catalog.get(code);
      return {
        code,
        name: entry?.name ?? fallback.name,
        description: entry?.description ?? fallback.description,
        icon: entry?.icon ?? null,
      };
    });

  const manualRow = first(first(row.product_manuals)?.manuals ?? null);

  return {
    id: row.id,
    modelName: row.model_name,
    name: row.name,
    category: row.category,
    shortDescription: row.short_description,
    description: row.description,
    price: row.price_amount,
    priceDisplayStatus: row.price_display_status,
    colors,
    images,
    thumbnailUrl: primary ? pickUrl(primary.variants, defaultColorId) : null,
    accessMethods,
    features,
    manual: manualRow
      ? { url: publicUrl(manualRow.storage_path), name: manualRow.original_name }
      : null,
  };
}

export async function getPublicProducts(
  options: { category?: ProductCategory; featuredOnly?: boolean } = {}
) {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('visibility', 'PUBLIC')
    .is('deleted_at', null);

  if (options.category) query = query.eq('category', options.category);

  query = options.featuredOnly
    ? query.eq('is_featured', true).order('featured_order', { ascending: true })
    : query.order('sort_order', { ascending: true });

  const [{ data, error }, catalog] = await Promise.all([query, getFeatureCatalog()]);
  if (error) throw new Error(`제품 목록 조회 실패: ${error.message}`);

  return (data as unknown as ProductRow[]).map((row) => toProductView(row, catalog));
}

// 페이지와 generateMetadata 가 같은 제품을 부르므로, 한 요청 안에서는 한 번만 조회한다.
export const getPublicProductById = cache(async (id: string) => {
  // uuid 형식이 아니면 DB 오류 대신 바로 "없음" 처리한다.
  if (!UUID_PATTERN.test(id)) return null;

  const supabase = await createClient();
  const [{ data, error }, catalog] = await Promise.all([
    supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('id', id)
      .eq('visibility', 'PUBLIC')
      .is('deleted_at', null)
      .maybeSingle(),
    getFeatureCatalog(),
  ]);

  if (error) throw new Error(`제품 조회 실패: ${error.message}`);
  return data ? toProductView(data as unknown as ProductRow, catalog) : null;
});
