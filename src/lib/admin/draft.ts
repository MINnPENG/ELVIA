import type { ExistingProductImage, ProductDraft, ProductFormValues } from './types';

const DRAFT_PREFIX = 'elvia:product-draft:';

/** draftKey: 등록은 'new', 수정은 제품 id */
export async function getDraft(draftKey: string): Promise<ProductDraft | null> {
  try {
    const raw = localStorage.getItem(DRAFT_PREFIX + draftKey);
    return raw ? (JSON.parse(raw) as ProductDraft) : null;
  } catch {
    return null;
  }
}

export async function saveDraft(draftKey: string, values: ProductFormValues): Promise<void> {
  // File은 저장할 수 없어서 이미 업로드된 이미지·설명서만 남김
  const draft: ProductDraft = {
    ...values,
    images: values.images.filter((img): img is ExistingProductImage => img.kind === 'existing'),
    manual: values.manual?.kind === 'existing' ? values.manual : null,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(DRAFT_PREFIX + draftKey, JSON.stringify(draft));
}

export async function clearDraft(draftKey: string): Promise<void> {
  try {
    localStorage.removeItem(DRAFT_PREFIX + draftKey);
  } catch {}
}
