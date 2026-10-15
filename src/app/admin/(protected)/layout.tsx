import type { ReactNode } from 'react';

import AdminHeader from '@/components/admin/AdminHeader';
import { requireAdmin } from '@/lib/auth/require-admin';

import { logout } from '../login/actions';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <>
      <AdminHeader logoutAction={logout} />
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8'>{children}</div>
    </>
  );
}
