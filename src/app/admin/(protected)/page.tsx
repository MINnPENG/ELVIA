import { requireAdmin } from '@/lib/auth/require-admin';

export default async function AdminHomePage() {
  await requireAdmin();

  return <h1 className='text-2xl font-bold'>관리자 대시보드</h1>;
}
