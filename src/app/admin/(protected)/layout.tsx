import type { ReactNode } from 'react';

import { requireAdmin } from '@/lib/auth/require-admin';

import { logout } from '../login/actions';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8'>
      <div className='flex items-center justify-between border-b pb-4'>
        <span className='font-bold'>{admin.display_name} 님</span>
        <form action={logout}>
          <button type='submit' className='text-sm underline'>
            로그아웃
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
