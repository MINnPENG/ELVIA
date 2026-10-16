'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useUrlFilters<K extends string>(keys: readonly K[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const values = Object.fromEntries(
    keys.map((key) => [key, searchParams.get(key) ?? ''])
  ) as Record<K, string>;

  const setFilters = (patch: Partial<Record<K, string>>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch) as [K, string][]) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete('page');
    const p = params.toString();
    router.replace(p ? `${pathname}?${p}` : pathname, { scroll: false });
  };

  const reset = () => router.replace(pathname, { scroll: false });

  return { values, setFilters, reset };
}
