'use server';

import { redirect } from 'next/navigation';

import { getActiveAdmin } from '@/lib/auth/require-admin';
import { createClient } from '@/lib/supabase/server';

export type LoginState = { error?: string };

const LOGIN_ERROR = '이메일 또는 비밀번호가 올바르지 않습니다.';

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) return { error: LOGIN_ERROR };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) return { error: LOGIN_ERROR };

  // 일반 Auth 사용자나 비활성 관리자는 세션을 바로 지우고 같은 오류를 보여준다.
  const admin = await getActiveAdmin(data.user.id);
  if (!admin) {
    await supabase.auth.signOut();
    return { error: LOGIN_ERROR };
  }

  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
