'use client';

import { useActionState } from 'react';

import { login, type LoginState } from './actions';

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className='flex w-full max-w-sm flex-col gap-4'>
      <label className='flex flex-col gap-1 text-sm'>
        이메일
        <input
          id='email'
          name='email'
          type='email'
          autoComplete='username'
          required
          className='rounded border border-gray-300 px-3 py-2'
        />
      </label>
      <label className='flex flex-col gap-1 text-sm'>
        비밀번호
        <input
          id='password'
          name='password'
          type='password'
          autoComplete='current-password'
          required
          className='rounded border border-gray-300 px-3 py-2'
        />
      </label>
      {state.error && (
        <p role='alert' className='text-sm text-red-600'>
          {state.error}
        </p>
      )}
      <button
        type='submit'
        disabled={pending}
        className='rounded bg-black px-4 py-2 text-white disabled:opacity-50'
      >
        {pending ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}
