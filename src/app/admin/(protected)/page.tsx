import { redirect } from 'next/navigation';

// 별도 대시보드 없이 제품 관리가 관리자 기본 화면이다.
export default function AdminHomePage() {
  redirect('/admin/products');
}
