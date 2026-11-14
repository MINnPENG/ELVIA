'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { clearDraft, getDraft, saveDraft } from '@/lib/admin/draft';
import type { AdminProductDetail, ProductDraft, ProductFormValues } from '@/lib/admin/types';
import { useToast } from '@/components/alert/Toast';
import { createProduct, updateProduct } from '@/lib/admin/mutation';

const PRODUCT_LIST_PATH = '/admin/products';

const EMPTY_VALUES: ProductFormValues = {
  category: '',
  visibility: '',
  modelName: '',
  name: '',
  price: '',
  sortOrder: '',
  images: [],
  summary: '',
  description: '',
  color: '',
  accessMethods: [],
  features: [],
  manual: null,
};

function toFormValues(product: AdminProductDetail): ProductFormValues {
  return {
    category: product.category,
    visibility: product.visibility,
    modelName: product.model_name,
    name: product.name,
    price: product.price_amount == null ? '' : String(product.price_amount),
    sortOrder: String(product.sort_order),
    images: product.images.map((img) => ({ kind: 'existing', ...img })),
    summary: product.summary,
    description: product.description,
    color: product.color,
    accessMethods: product.access_methods,
    features: product.features,
    manual: product.manual
      ? { kind: 'existing', url: product.manual.url, fileName: product.manual.file_name }
      : null,
  };
}

function draftToFormValues({ savedAt: _savedAt, ...values }: ProductDraft): ProductFormValues {
  return values;
}

function getMissingMessage(values: ProductFormValues) {
  if (values.images.length === 0) return '제품 이미지를 1장 이상 등록해 주세요.';
  if (values.accessMethods.length === 0) return '출입 방식을 1개 이상 선택해 주세요.';
  if (values.features.length === 0) return '주요 기능을 1개 이상 선택해 주세요.';
  return null;
}

function revokePreviews(values: ProductFormValues) {
  values.images.forEach((img) => img.kind === 'new' && URL.revokeObjectURL(img.previewUrl));
}

export function useProductForm(product?: AdminProductDetail) {
  const router = useRouter();
  const { show } = useToast();

  const isEdit = Boolean(product);
  const draftKey = product?.id ?? 'new';

  const [values, setValues] = useState<ProductFormValues>(() =>
    product ? toFormValues(product) : EMPTY_VALUES
  );
  const [formKey, setFormKey] = useState(0);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let ignore = false;
    getDraft(draftKey).then((draft) => {
      if (ignore || !draft) return;
      setValues(draftToFormValues(draft));
      setFormKey((k) => k + 1);
      show({
        type: 'info',
        title: '임시 저장',
        message: isEdit ? '임시 저장된 내용을 불러왔습니다.' : '작성 중이던 내용을 불러왔습니다.',
      });
    });
    return () => {
      ignore = true;
    };
  }, [draftKey, isEdit, show]);

  const setField = useCallback(
    <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = () => {
    revokePreviews(values);
    setValues(EMPTY_VALUES);
    setFormKey((k) => k + 1);
  };

  const showError = useCallback(
    (message: string) => show({ type: 'error', title: '입력 확인', message }),
    [show]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const missing = getMissingMessage(values);
    if (missing) return showError(missing);

    setPending(true);
    try {
      if (product) {
        await updateProduct(product.id, values);
        await clearDraft(draftKey);
        show({ type: 'success', title: '수정 완료', message: '제품이 수정되었습니다.' });
        router.push(PRODUCT_LIST_PATH);
      } else {
        await createProduct(values);
        await clearDraft(draftKey);
        show({ type: 'success', title: '등록 완료', message: '제품이 등록되었습니다.' });
        reset();
        window.scrollTo({ top: 0 });
      }
    } catch {
      show({
        type: 'error',
        title: isEdit ? '수정 실패' : '등록 실패',
        message: '입력한 내용은 유지되었습니다. 잠시 후 다시 시도해 주세요.',
      });
    } finally {
      setPending(false);
    }
  };

  const handleSaveDraft = async () => {
    setPending(true);
    try {
      await saveDraft(draftKey, values);
      show({ type: 'info', title: '임시 저장', message: '작성 중인 내용이 저장되었습니다.' });
      router.push(PRODUCT_LIST_PATH);
    } catch {
      show({ type: 'error', title: '저장 실패', message: '잠시 후 다시 시도해 주세요.' });
    } finally {
      setPending(false);
    }
  };

  const handleCancel = () => {
    revokePreviews(values);
    router.push(PRODUCT_LIST_PATH);
  };

  return {
    values,
    setField,
    formKey,
    pending,
    handleSubmit,
    handleSaveDraft,
    handleCancel,
    showError,
  };
}
