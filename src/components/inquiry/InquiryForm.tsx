'use client';

import { useState, type FormEvent } from 'react';
import {
  FILE_MAX_SIZE,
  INITIAL_INQUIRY,
  InquiryFormValues,
  submitInquiry,
  TITLE_MAX_LENGTH,
  validatePassword,
} from '../inputs/inquiry';
import Input, { SelectOption } from '../inputs';
import Link from 'next/link';
import type { CreatedInquiry } from '@/lib/inquiries/schema';
import { ActionButton, SubmitButton } from '../buttons/Buttons';

type Status = 'idle' | 'submitting' | 'error';

const INQUIRY_TYPES: SelectOption[] = [
  { label: '수리 문의', value: 'repair', description: '고장·A/S 접수 문의' },
  { label: '구매 문의', value: 'purchase', description: '가격·구매처 문의' },
  { label: '제품 문의', value: 'product', description: '도어락 사용·설치 문의' },
];

type InquiryFormProps = {
  onSuccess: (inquiry: CreatedInquiry) => void;
};

export default function InquiryForm({ onSuccess }: InquiryFormProps) {
  const [values, setValues] = useState<InquiryFormValues>(INITIAL_INQUIRY);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isSubmitting = status === 'submitting';

  const updateField = <K extends keyof InquiryFormValues>(key: K, value: InquiryFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const send = async () => {
    setStatus('submitting');
    setErrorMessage('');
    try {
      const result = await submitInquiry(values, agreed);
      onSuccess(result);
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : '문의 접수 중 문제가 생겼습니다.');
      setStatus('error');
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !agreed) return;
    send();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2'>
          <Input
            type='select'
            label='문의 유형'
            required
            placeholder='문의 유형을 선택해 주세요.'
            options={INQUIRY_TYPES}
            value={values.type}
            onChange={(value) => updateField('type', value)}
          />
          <Input
            label='제품명'
            placeholder='제품명을 입력해 주세요.'
            hint='모델을 모르면 비워두셔도 됩니다.'
            value={values.productName}
            onChange={(e) => updateField('productName', e.target.value)}
          />
          <Input
            label='이름 / 업체명'
            required
            placeholder='이름을 입력해 주세요.'
            hint='답변 안내에 사용됩니다.'
            value={values.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          <Input
            type='email'
            label='이메일'
            required
            placeholder='email@example.com'
            hint='답변 완료 알림을 보내드립니다.'
            value={values.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
          <Input
            label='문의 제목'
            required
            placeholder='문의 제목을 입력해 주세요.'
            hint={`최대 ${TITLE_MAX_LENGTH}자`}
            maxLength={TITLE_MAX_LENGTH}
            value={values.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
          <Input
            type='file'
            label='첨부파일'
            placeholder='사진 또는 PDF를 선택해 주세요.'
            hint='최대 10MB'
            accept='image/*,.pdf'
            maxSize={FILE_MAX_SIZE}
            onFilesChange={(files) => updateField('file', files[0] ?? null)}
          />
          <Input
            type='textarea'
            label='문의 내용'
            required
            placeholder='제품 사용 중 궁금한 점과 현재 증상을 자세히 입력해 주세요.'
            containerClassName='md:col-span-2'
            value={values.content}
            onChange={(e) => updateField('content', e.target.value)}
          />
          <Input
            type='password'
            label='문의 확인 비밀번호'
            required
            validate={validatePassword}
            placeholder='영문·숫자 포함 4자 이상'
            hint='답변 확인 시 필요합니다.'
            autoComplete='new-password'
            value={values.password}
            onChange={(e) => updateField('password', e.target.value)}
          />
        </div>

        {status === 'error' && (
          <p role='alert' className='text-[14px] leading-5.5 text-[#D92D20]'>
            {errorMessage}
          </p>
        )}

        <div className='flex flex-col gap-7 pt-6 md:justify-between'>
          <label className='flex cursor-pointer items-center gap-0.5 text-[14px] leading-5.5 text-[#101828]'>
            <input
              type='checkbox'
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className='size-5 cursor-pointer border-[#D0D5DD] accent-[#1F66E5]'
            />
            개인정보 수집·이용에 동의합니다.{' '}
            <Link href='/' className='ml-1'>
              자세히 보기
            </Link>
          </label>

          <div className='flex items-center justify-end gap-3'>
            <ActionButton
              className='h-12 w-30 rounded-lg px-5 py-3.5 text-[14px] leading-5 font-bold'
              variant='surface'
            >
              취소
            </ActionButton>
            <SubmitButton
              variant='primary'
              disabled={!agreed || isSubmitting}
              className='h-12 w-45 rounded-lg px-5 py-3.5 text-[14px] leading-5 font-bold'
            >
              {isSubmitting ? '전송 중...' : '문의 등록'}
            </SubmitButton>
          </div>
        </div>
      </form>
    </>
  );
}
