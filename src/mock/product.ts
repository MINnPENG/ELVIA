/**
 * ELVIA 제품 목데이터
 * - ERD 테이블 구조(snake_case)를 그대로 따름 → 나중에 DB 응답으로 교체하기 쉬움
 * - ⚠️ 표시가 붙은 컬럼/테이블은 ERD에 없어서 추가 제안한 것
 * - 이미지·PDF 경로는 public/mock/ 아래에 실제 파일을 넣어야 화면에 보임
 */

// ─────────────────────────────────────────────
// 타입
// ─────────────────────────────────────────────
export type Visibility = 'PUBLIC' | 'PRIVATE';
export type LifecycleStatus = 'ACTIVE' | 'DELETED';

export type ProductCategory = {
  id: number;
  code: 'DOOR_LOCK' | 'ACCESSORY';
  name: string;
  is_active: boolean;
  sort_order: number;
};

export type Product = {
  id: string;
  category_id: number;
  created_by: string;
  name: string; // 화면 제목 (예: ER-10N)
  model_name: string;
  price: number; // DB decimal은 드라이버에 따라 string으로 올 수 있음
  visibility: Visibility;
  sort_order: number;
  short_description: string;
  description: string;
  lifecycle_status: LifecycleStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ProductColor = {
  id: string;
  product_id: string;
  color_name: string;
  color_code: string;
  display_order: number;
};

export type ProductFeature = {
  id: number;
  code: string;
  name: string;
  description: string; // ⚠️ ERD에 없음 — 주요 기능 카드 설명용
  is_active: boolean;
};

export type AccessMethod = {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
};

export type ProductFeatureMap = { product_id: string; feature_id: number };
export type ProductAccessMethod = { product_id: string; access_method_id: number };

/** ⚠️ files 테이블은 캡처에 없어서 일반적인 구조로 가정 */
export type FileRecord = {
  id: string;
  storage_path: string;
  url: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

/** 크롭 영역 (0~1 비율) */
export type CropData = { x: number; y: number; width: number; height: number };

export type ProductImage = {
  id: string;
  product_id: string;
  file_id: string;
  color_id: string | null; // ⚠️ ERD에 없음 — 색상별 이미지 전환용, null이면 모든 색상 공통
  display_order: number;
  is_primary: boolean;
  crop_data: CropData | null;
  created_at: string;
};

export type ProductManual = {
  product_id: string; // PK — 제품당 1개
  file_id: string;
  created_at: string;
};

// ─────────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────────
const uid = (prefix: string, n: number) =>
  `${prefix}0000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

const NOW = '2026-09-01T09:00:00+09:00';
export const ADMIN_ID = uid('a', 1);

// ─────────────────────────────────────────────
// 마스터 데이터
// ─────────────────────────────────────────────
export const productCategories: ProductCategory[] = [
  { id: 1, code: 'DOOR_LOCK', name: '도어락', is_active: true, sort_order: 1 },
  { id: 2, code: 'ACCESSORY', name: '악세사리', is_active: true, sort_order: 2 },
];

export const accessMethods: AccessMethod[] = [
  { id: 1, code: 'CARD_KEY', name: '카드키', is_active: true },
  { id: 2, code: 'PASSWORD', name: '비밀번호', is_active: true },
  { id: 3, code: 'FINGERPRINT', name: '지문', is_active: true },
];

export const productFeatures: ProductFeature[] = [
  {
    id: 1,
    code: 'HIGH_TEMP_ALARM',
    name: '고온경보',
    description: '화재 감지 시 경보 후 자동 열림',
    is_active: true,
  },
  {
    id: 2,
    code: 'FAKE_PIN',
    name: '허수기능',
    description: '임의 번호로 비밀번호 노출 방지',
    is_active: true,
  },
  {
    id: 3,
    code: 'OPEN_CLOSE_INDICATOR',
    name: '열림/닫힘 표시',
    description: '실내에서 잠금 상태 확인',
    is_active: true,
  },
  {
    id: 4,
    code: 'LED_STATUS',
    name: '상태 표시 (LED)',
    description: 'LED로 작동 상태 안내',
    is_active: true,
  },
  {
    id: 5,
    code: 'AUTO_LOCK',
    name: '바로잠김',
    description: '문이 닫히면 자동 잠금',
    is_active: true,
  },
  {
    id: 6,
    code: 'ANTI_TAMPER',
    name: '장난방지',
    description: '실내 버튼 오작동 방지',
    is_active: true,
  },
  {
    id: 7,
    code: 'NO_DRILL_INSTALL',
    name: '무타공 설치',
    description: '추가 타공 없이 간편 설치',
    is_active: true,
  },
];

// ─────────────────────────────────────────────
// 제품
// ─────────────────────────────────────────────
const P = {
  ER10N: uid('b', 1),
  ER20F: uid('b', 2), // 가상 제품
  ER30C: uid('b', 3), // 가상 제품
  EC01: uid('b', 4), // 가상 제품 (악세사리)
  TEST_PRIVATE: uid('b', 5),
  TEST_DELETED: uid('b', 6),
} as const;

const baseProduct = {
  created_by: ADMIN_ID,
  visibility: 'PUBLIC' as Visibility,
  lifecycle_status: 'ACTIVE' as LifecycleStatus,
  created_at: NOW,
  updated_at: NOW,
  deleted_at: null,
};

export const products: Product[] = [
  {
    ...baseProduct,
    id: P.ER10N,
    category_id: 1,
    name: 'ER-10N',
    model_name: 'ER-10N',
    price: 98000,
    sort_order: 1,
    short_description: '컴팩트한 디자인, 간편한 사용성의 스마트 도어락',
    description:
      '작고 세련된 디자인으로 다양한 공간에 자연스럽게 어울리며,\n비밀번호 출입과 편리한 잠금 기능으로 일상에 스마트한 보안을 더해줍니다.',
  },
  {
    ...baseProduct,
    id: P.ER20F,
    category_id: 1,
    name: 'ER-20F',
    model_name: 'ER-20F',
    price: 189000,
    sort_order: 2,
    short_description: '빠른 지문 인식으로 열쇠 없이 여는 스마트 도어락',
    description:
      '지문과 비밀번호를 함께 지원해 상황에 맞게 출입할 수 있습니다.\n고온경보와 허수기능으로 안전과 보안을 함께 챙겼습니다.',
  },
  {
    ...baseProduct,
    id: P.ER30C,
    category_id: 1,
    name: 'ER-30C',
    model_name: 'ER-30C',
    price: 129000,
    sort_order: 3,
    short_description: '카드키와 비밀번호를 지원하는 무타공 도어락',
    description:
      '문에 구멍을 뚫지 않고 설치할 수 있어 전월세 공간에도 부담이 없습니다.\n카드키 한 번으로 빠르게 출입할 수 있습니다.',
  },
  {
    ...baseProduct,
    id: P.EC01,
    category_id: 2,
    name: 'EC-01',
    model_name: 'EC-01',
    price: 15000,
    sort_order: 1,
    short_description: '휴대폰 뒷면에 붙여 쓰는 스티커형 카드키',
    description:
      'ELVIA 카드키 지원 도어락과 호환되는 스티커형 카드키입니다.\n휴대폰 케이스나 사원증 뒷면에 붙여 사용할 수 있습니다.',
  },
  // ── 노출 필터 테스트용 (사용자 화면에 나오면 안 됨) ──
  {
    ...baseProduct,
    id: P.TEST_PRIVATE,
    category_id: 1,
    name: 'ER-90X',
    model_name: 'ER-90X',
    price: 349000,
    visibility: 'PRIVATE',
    sort_order: 0,
    short_description: '출시 예정 신제품',
    description: '출시 준비 중인 제품입니다.',
  },
  {
    ...baseProduct,
    id: P.TEST_DELETED,
    category_id: 1,
    name: 'ER-05N',
    model_name: 'ER-05N',
    price: 79000,
    sort_order: 4,
    short_description: '단종된 구형 모델',
    description: '단종된 제품입니다.',
    lifecycle_status: 'DELETED',
    deleted_at: '2026-09-15T10:00:00+09:00',
  },
];

// ─────────────────────────────────────────────
// 색상
// ─────────────────────────────────────────────
const C = {
  ER10N_RED: uid('c', 1),
  ER10N_SILVER: uid('c', 2),
  ER10N_BLACK: uid('c', 3),
  ER20F_BLACK: uid('c', 4),
  ER20F_GRAY: uid('c', 5),
  ER30C_SILVER: uid('c', 6),
  EC01_BLACK: uid('c', 7),
} as const;

export const productColors: ProductColor[] = [
  {
    id: C.ER10N_RED,
    product_id: P.ER10N,
    color_name: '레드',
    color_code: '#8B1E1E',
    display_order: 1,
  },
  {
    id: C.ER10N_SILVER,
    product_id: P.ER10N,
    color_name: '실버',
    color_code: '#D4D4D4',
    display_order: 2,
  },
  {
    id: C.ER10N_BLACK,
    product_id: P.ER10N,
    color_name: '블랙',
    color_code: '#111111',
    display_order: 3,
  },
  {
    id: C.ER20F_BLACK,
    product_id: P.ER20F,
    color_name: '블랙',
    color_code: '#1A1A1A',
    display_order: 1,
  },
  {
    id: C.ER20F_GRAY,
    product_id: P.ER20F,
    color_name: '그레이',
    color_code: '#8A8D91',
    display_order: 2,
  },
  {
    id: C.ER30C_SILVER,
    product_id: P.ER30C,
    color_name: '실버',
    color_code: '#C0C0C0',
    display_order: 1,
  },
  {
    id: C.EC01_BLACK,
    product_id: P.EC01,
    color_name: '블랙',
    color_code: '#222222',
    display_order: 1,
  },
];

// ─────────────────────────────────────────────
// 매핑 테이블
// ─────────────────────────────────────────────
export const productAccessMethods: ProductAccessMethod[] = [
  { product_id: P.ER10N, access_method_id: 2 },
  { product_id: P.ER20F, access_method_id: 2 },
  { product_id: P.ER20F, access_method_id: 3 },
  { product_id: P.ER30C, access_method_id: 1 },
  { product_id: P.ER30C, access_method_id: 2 },
  { product_id: P.EC01, access_method_id: 1 },
  { product_id: P.TEST_PRIVATE, access_method_id: 3 },
  { product_id: P.TEST_DELETED, access_method_id: 2 },
];

export const productFeatureMaps: ProductFeatureMap[] = [
  // ER-10N
  { product_id: P.ER10N, feature_id: 5 },
  { product_id: P.ER10N, feature_id: 2 },
  { product_id: P.ER10N, feature_id: 4 },
  { product_id: P.ER10N, feature_id: 3 },
  // ER-20F
  { product_id: P.ER20F, feature_id: 1 },
  { product_id: P.ER20F, feature_id: 2 },
  { product_id: P.ER20F, feature_id: 5 },
  { product_id: P.ER20F, feature_id: 6 },
  // ER-30C
  { product_id: P.ER30C, feature_id: 7 },
  { product_id: P.ER30C, feature_id: 5 },
  { product_id: P.ER30C, feature_id: 4 },
  // EC-01: 해당 기능 없음 (악세사리 필수값 정책 결정 필요)
  { product_id: P.TEST_PRIVATE, feature_id: 5 },
  { product_id: P.TEST_DELETED, feature_id: 2 },
];

// ─────────────────────────────────────────────
// 파일 · 이미지 · 사용설명서
// ─────────────────────────────────────────────
export const files: FileRecord[] = [];
export const productImages: ProductImage[] = [];
export const productManuals: ProductManual[] = [];

let fileSeq = 0;
let imageSeq = 0;

function addFile(path: string, originalName: string, mime: string, size: number): FileRecord {
  const file: FileRecord = {
    id: uid('f', ++fileSeq),
    storage_path: path,
    url: `/mock/${path}`,
    original_name: originalName,
    mime_type: mime,
    size_bytes: size,
    created_at: NOW,
  };
  files.push(file);
  return file;
}

function addImage(
  productId: string,
  path: string,
  colorId: string | null,
  order: number,
  isPrimary = false,
  crop: CropData | null = null
) {
  const file = addFile(path, path.split('/').pop()!, 'image/webp', 180_000);
  productImages.push({
    id: uid('d', ++imageSeq),
    product_id: productId,
    file_id: file.id,
    color_id: colorId,
    display_order: order,
    is_primary: isPrimary,
    crop_data: crop,
    created_at: NOW,
  });
}

function addManual(productId: string, path: string, originalName: string) {
  const file = addFile(path, originalName, 'application/pdf', 2_400_000);
  productManuals.push({ product_id: productId, file_id: file.id, created_at: NOW });
}

// ER-10N — 블랙이 대표(is_primary)라 상세 진입 시 블랙이 선택된 상태로 시작
addImage(P.ER10N, 'products/er-10n/black-front.webp', C.ER10N_BLACK, 1, true);
addImage(P.ER10N, 'products/er-10n/black-off.webp', C.ER10N_BLACK, 2);
addImage(P.ER10N, 'products/er-10n/black-keypad.webp', C.ER10N_BLACK, 3);
addImage(P.ER10N, 'products/er-10n/black-open.webp', C.ER10N_BLACK, 4);
addImage(P.ER10N, 'products/er-10n/red-front.webp', C.ER10N_RED, 1);
addImage(P.ER10N, 'products/er-10n/red-keypad.webp', C.ER10N_RED, 2);
addImage(P.ER10N, 'products/er-10n/silver-front.webp', C.ER10N_SILVER, 1);
addImage(P.ER10N, 'products/er-10n/silver-keypad.webp', C.ER10N_SILVER, 2);
addImage(P.ER10N, 'products/er-10n/inside.webp', null, 10, false, {
  x: 0,
  y: 0.1,
  width: 1,
  height: 0.8,
}); // 색상 공통

// ER-20F
addImage(P.ER20F, 'products/er-20f/black-front.webp', C.ER20F_BLACK, 1, true);
addImage(P.ER20F, 'products/er-20f/gray-front.webp', C.ER20F_GRAY, 1);
addImage(P.ER20F, 'products/er-20f/side.webp', null, 10);

// ER-30C / EC-01 — 단일 색상이라 color_id 없이 등록
addImage(P.ER30C, 'products/er-30c/front.webp', null, 1, true);
addImage(P.ER30C, 'products/er-30c/side.webp', null, 2);
addImage(P.EC01, 'products/ec-01/main.webp', null, 1, true);

// 테스트용
addImage(P.TEST_PRIVATE, 'products/er-90x/main.webp', null, 1, true);
addImage(P.TEST_DELETED, 'products/er-05n/main.webp', null, 1, true);

// 사용설명서 — 악세사리는 없음 (버튼 숨김 처리)
addManual(P.ER10N, 'manuals/er-10n.pdf', 'ELVIA_ER-10N_사용설명서.pdf');
addManual(P.ER20F, 'manuals/er-20f.pdf', 'ELVIA_ER-20F_사용설명서.pdf');
addManual(P.ER30C, 'manuals/er-30c.pdf', 'ELVIA_ER-30C_사용설명서.pdf');

// ─────────────────────────────────────────────
// 화면용 타입 + 헬퍼
// ─────────────────────────────────────────────
export type ProductImageView = ProductImage & { url: string };

export type ProductView = Product & {
  category: ProductCategory;
  colors: ProductColor[];
  accessMethods: AccessMethod[];
  features: ProductFeature[];
  images: ProductImageView[];
  primaryImage: ProductImageView | null;
  manual: FileRecord | null;
};

const fileById = (id: string) => files.find((f) => f.id === id)!;
const categoryById = (id: number) => productCategories.find((c) => c.id === id)!;

const isVisible = (p: Product) =>
  p.visibility === 'PUBLIC' &&
  p.lifecycle_status === 'ACTIVE' &&
  categoryById(p.category_id).is_active;

const toView = (p: Product): ProductView => {
  const images = productImages
    .filter((i) => i.product_id === p.id)
    .sort((a, b) => a.display_order - b.display_order)
    .map((i) => ({ ...i, url: fileById(i.file_id).url }));
  const manual = productManuals.find((m) => m.product_id === p.id);

  return {
    ...p,
    category: categoryById(p.category_id),
    colors: productColors
      .filter((c) => c.product_id === p.id)
      .sort((a, b) => a.display_order - b.display_order),
    accessMethods: productAccessMethods
      .filter((m) => m.product_id === p.id)
      .map((m) => accessMethods.find((a) => a.id === m.access_method_id)!)
      .filter((a) => a.is_active),
    features: productFeatureMaps
      .filter((m) => m.product_id === p.id)
      .map((m) => productFeatures.find((f) => f.id === m.feature_id)!)
      .filter((f) => f.is_active),
    images,
    primaryImage: images.find((i) => i.is_primary) ?? images[0] ?? null,
    manual: manual ? fileById(manual.file_id) : null,
  };
};

/** 제품 목록 (카테고리 코드 생략 시 전체) — sort_order 오름차순 */
export function getProducts(categoryCode?: ProductCategory['code']): ProductView[] {
  const category = productCategories.find((c) => c.code === categoryCode);
  return products
    .filter(isVisible)
    .filter((p) => !category || p.category_id === category.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(toView);
}

/** 제품 상세 — 비공개/삭제 제품은 null (→ notFound()) */
export function getProductById(id: string): ProductView | null {
  const product = products.find((p) => p.id === id);
  return product && isVisible(product) ? toView(product) : null;
}

/** 관련 제품 — 현재 제품 제외, 같은 카테고리 우선 */
export function getRelatedProducts(id: string, limit = 4): ProductView[] {
  const current = products.find((p) => p.id === id);
  if (!current) return [];
  return products
    .filter((p) => isVisible(p) && p.id !== id)
    .sort((a, b) => {
      const aSame = a.category_id === current.category_id ? 0 : 1;
      const bSame = b.category_id === current.category_id ? 0 : 1;
      return aSame - bSame || a.sort_order - b.sort_order;
    })
    .slice(0, limit)
    .map(toView);
}

/** 상세 진입 시 기본 선택 색상 — 대표 이미지의 색상, 없으면 첫 번째 색상 */
export function getDefaultColorId(product: ProductView): string | null {
  return product.primaryImage?.color_id ?? product.colors[0]?.id ?? null;
}

/** 선택한 색상의 이미지 + 색상 공통 이미지. 해당 색상 이미지가 없으면 전체 */
export function getImagesForColor(
  product: ProductView,
  colorId: string | null
): ProductImageView[] {
  const matched = product.images.filter((i) => i.color_id === colorId || i.color_id === null);
  return matched.length > 0 ? matched : product.images;
}
