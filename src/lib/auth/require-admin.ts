import 'server-only';

import { redirect } from 'next/navigation';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function getActiveAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from('admin_profiles')
    .select('id, display_name')
    .eq('id', userId)
    .eq('status', 'ACTIVE')
    .maybeSingle();

  return data;
}

export async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  if (!userId) redirect('/admin/login');

  const admin = await getActiveAdmin(userId);
  if (!admin) redirect('/admin/login');

  return admin;
}
