'use client';

import Input from '@/components/inputs';
import FormSection from './FormSection';
import ImageUploadBox from './ImageUploadBox';
import ChipGroup from '@/components/buttons/ChipGroup';
import { ActionButton, SubmitButton } from '@/components/buttons/Buttons';
import type { AccessMethodCode, FeatureCode, ProductCategory } from '@/lib/products/types';
import type { AdminProductDetail, ProductFormValues } from '@/lib/admin/types';
import { useProductForm } from '@/hooks/useProductForm';

const CATEGORY_OPTIONS = [
  { label: '도어락', value: 'DOOR_LOCK' },
  { label: '악세사리', value: 'ACCESSORY' },
];

const VISIBILITY_OPTIONS = [
  { label: '공개', value: 'PUBLIC' },
  { label: '비공개', value: 'PRIVATE' },
];

const ACCESS_METHOD_OPTIONS: { label: string; value: AccessMethodCode }[] = [
  { label: '카드키', value: 'CARD_KEY' },
  { label: '비밀번호', value: 'PASSWORD' },
  { label: '지문', value: 'FINGERPRINT' },
];

const FEATURE_OPTIONS: { label: string; value: FeatureCode }[] = [
  { label: '고온경보', value: 'HIGH_TEMP_ALARM' },
  { label: '허수기능', value: 'FAKE_PIN' },
  { label: '열림/닫힘', value: 'OPEN_CLOSE_INDICATOR' },
  { label: '상태 LED', value: 'STATUS_LED' },
  { label: '바로잠김', value: 'AUTO_LOCK' },
  { label: '장난방지', value: 'TAMPER_PROTECTION' },
  { label: '무타공', value: 'NO_DRILL_INSTALLATION' },
];

interface ProductFormProps {
  mode: 'create' | 'edit';
  product?: AdminProductDetail;
}

export default function ProductForm({ mode, product }: ProductFormProps) {
  const isEdit = mode === 'edit';

  const {
    values,
    setField,
    formKey,
    pending,
    handleSubmit,
    handleSaveDraft,
    handleCancel,
    showError,
  } = useProductForm(isEdit ? product : undefined);

  return (
    <form key={formKey} onSubmit={handleSubmit} className='flex flex-col'>
      <div className='flex items-end justify-between border-b border-[#EAECF0] pb-1.75'>
        <div className='flex flex-col gap-1.5'>
          <h1 className='text-[36px] leading-11.5 font-bold text-[#101828]'>
            {isEdit ? '제품 수정' : '제품 등록'}
          </h1>
          <p className='text-[14px] leading-5.5 text-[#667085]'>
            사이트에 노출될 제품 정보를 입력합니다.
          </p>
        </div>
        <span className='text-[12px] leading-4.5 text-[#667085]'>* 필수 입력</span>
      </div>

      <FormSection title='기본 정보' description='제품 목록과 검색에 사용되는 정보입니다.'>
        <div className='grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2'>
          <Input
            type='select'
            label='제품 분류'
            required
            options={CATEGORY_OPTIONS}
            placeholder='도어락'
            hint='도어락 / 악세사리'
            value={values.category}
            onChange={(v) => setField('category', v as ProductCategory)}
          />
          <Input
            type='select'
            label='노출 상태'
            required
            options={VISIBILITY_OPTIONS}
            placeholder='공개'
            hint='공개 / 비공개'
            value={values.visibility}
            onChange={(v) => setField('visibility', v as ProductFormValues['visibility'])}
          />
          <Input
            label='모델명'
            required
            placeholder='모델명을 입력해 주세요.'
            hint='중복 불가'
            value={values.modelName}
            onChange={(e) => setField('modelName', e.target.value)}
          />
          <Input
            label='제품명'
            placeholder='제품명을 입력해 주세요.'
            hint='사이트 표시명'
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
          />
          <Input
            type='number'
            label='가격'
            required
            placeholder='숫자만 입력해 주세요.'
            hint='소비자가'
            value={values.price}
            onChange={(e) => setField('price', e.target.value)}
          />
          <Input
            type='number'
            label='노출 순서'
            placeholder='1'
            hint='숫자가 작을수록 먼저 노출'
            value={values.sortOrder}
            onChange={(e) => setField('sortOrder', e.target.value)}
          />
        </div>
      </FormSection>

      <FormSection title='제품 이미지' description='원본 비율을 유지하고 여백으로 규격을 맞춥니다.'>
        <ImageUploadBox
          value={values.images}
          onChange={(images) => setField('images', images)}
          onError={showError}
        />
      </FormSection>

      <FormSection
        title='상세 정보'
        description='제품 상세 페이지에서 소비자가 확인하는 정보입니다.'
      >
        <div className='flex flex-col gap-6'>
          <div className='grid grid-cols-2 gap-x-6'>
            <Input
              label='한 줄 소개'
              required
              placeholder='제품의 핵심 특징을 입력해 주세요.'
              hint='목록과 상세 상단에 표시'
              value={values.summary}
              onChange={(e) => setField('summary', e.target.value)}
            />
            <Input
              label='색상'
              placeholder='예: 블랙, 실버, 레드'
              hint='ER-10N은 3색 지원'
              value={values.color}
              onChange={(e) => setField('color', e.target.value)}
            />
          </div>
          <Input
            type='textarea'
            label='상세 설명'
            required
            placeholder='제품의 특징과 사용 환경을 입력해 주세요.'
            value={values.description}
            onChange={(e) => setField('description', e.target.value)}
          />
          <ChipGroup
            label='출입 방식'
            required
            options={ACCESS_METHOD_OPTIONS}
            value={values.accessMethods}
            onChange={(v) => setField('accessMethods', v)}
          />
          <ChipGroup
            label='주요 기능'
            required
            options={FEATURE_OPTIONS}
            value={values.features}
            onChange={(v) => setField('features', v)}
          />
          <Input
            type='file'
            label='사용 설명서'
            accept='application/pdf'
            placeholder={
              values.manual?.kind === 'existing'
                ? values.manual.fileName
                : 'PDF 파일을 선택해 주세요.'
            }
            hint='PDF만 업로드 가능'
            containerClassName='max-w-[calc(50%-12px)]'
            onFilesChange={(files) =>
              setField('manual', files[0] ? { kind: 'new', file: files[0] } : null)
            }
          />
        </div>
      </FormSection>

      <div className='flex justify-end gap-3 py-5'>
        <ActionButton
          variant='surface'
          border='red'
          className='h-12 rounded-sm !bg-[#FEF3F2] px-5 py-3.5 text-[14px] leading-5 font-bold text-[#D92D20] hover:!bg-[#fce8e7]'
          onClick={handleCancel}
          disabled={pending}
        >
          취소
        </ActionButton>
        {!isEdit && (
          <ActionButton
            variant='surface'
            className='h-12 rounded-sm px-5 py-3.5 text-[14px] leading-5 font-bold text-[#0B2447]'
            onClick={handleSaveDraft}
            disabled={pending}
          >
            임시 저장
          </ActionButton>
        )}
        <SubmitButton
          className='h-12 rounded-sm px-5 py-3.5 text-[14px] font-bold'
          disabled={pending}
        >
          {isEdit ? '제품 수정' : '제품 등록'}
        </SubmitButton>
      </div>
    </form>
  );
}
