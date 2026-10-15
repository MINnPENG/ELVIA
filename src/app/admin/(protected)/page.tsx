import Link from 'next/link';

import { requireAdmin } from '@/lib/auth/require-admin';

export default async function AdminHomePage() {
  await requireAdmin();

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>관리자 대시보드</h1>
      <Link href='/admin/products' className='underline'>
        제품 관리
      </Link>
      <Link href='/admin/inquiries' className='underline'>
        문의 관리
      </Link>
    </div>
  );
}
