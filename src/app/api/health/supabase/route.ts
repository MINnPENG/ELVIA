import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const hasEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  if (!hasEnv) {
    return NextResponse.json({ ok: false, database: 'misconfigured' }, { status: 500 });
  }

  try {
    const supabase = await createClient();

    // 공개 제품 쿼리가 오류 없이 실행되는지만 확인한다. 데이터는 반환하지 않는다.
    const { error } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('visibility', 'PUBLIC')
      .is('deleted_at', null);

    if (error) {
      return NextResponse.json({ ok: false, database: 'query_failed' }, { status: 503 });
    }

    return NextResponse.json({ ok: true, database: 'reachable' });
  } catch {
    return NextResponse.json({ ok: false, database: 'unreachable' }, { status: 503 });
  }
}
