'use client';

import Input from '../inputs';
import { SubmitButton } from '../buttons/Buttons';
import { useRouter } from 'next/navigation';
import { FormEvent, useState, useTransition } from 'react';
import { verifyInquiryAccessAction } from '@/app/inquiry-list/actions';

export default function CheckMyInquiryCard({ selectedId }: { selectedId: string | null }) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedId) return;

    startTransition(async () => {
      const result = await verifyInquiryAccessAction(selectedId, email, password);

      if (result.ok) router.push(`/inquiry-list/${selectedId}`);
      else setErrorMessage(result.error);
    });
  };

  return (
    <div className='flex h-130 flex-col gap-6 bg-[#071A33] p-8'>
      <p className='text-[28px] leading-9.5 font-bold text-white'>내 문의 확인</p>
      <p className='text-[14px] leading-5.5 text-white'>
        조회할 문의를 선택한 뒤 이메일과 비밀번호를 입력해 주세요.
      </p>

      <form onSubmit={handleSubmit} className='mt-6 flex flex-col gap-6'>
        <Input
          label=''
          type='email'
          hint='문의 작성 시 입력한 이메일'
          required
          placeholder='email@example.com'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrorMessage('');
          }}
          disabled={!selectedId}
        />

        <Input
          label=''
          type='password'
          hint='작성 시 설정한 비밀번호'
          required
          placeholder='비밀번호'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorMessage('');
          }}
          error={errorMessage || undefined}
          disabled={!selectedId}
        />

        <SubmitButton
          disabled={!selectedId || isPending}
          className='rounded-lg px-5 py-3.5 text-[14px] leading-5 font-bold'
        >
          {isPending ? '확인 중...' : '문의 확인'}
        </SubmitButton>
      </form>

      <p className='text-[12px] leading-4.5 text-white'>
        인증 실패가 반복되면 잠시 후 다시 시도해 주세요.
      </p>
    </div>
  );
}
