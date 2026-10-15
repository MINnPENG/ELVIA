'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { href: '/admin/products', label: '제품 관리' },
  { href: '/admin/inquiries', label: '문의 관리' },
];

type AdminHeaderProps = {
  logoutAction: () => Promise<void>;
};

export default function AdminHeader({ logoutAction }: AdminHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header className='sticky top-0 z-10 border-b border-[#EAECF0] bg-white'>
      <div className='mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-6'>
        <Link href='/admin' className='text-[24px] font-bold tracking-wide text-[#101828]'>
          ELVIA <span className='text-[14px] font-medium text-[#667085]'>ADMIN</span>
        </Link>

        <div className='flex items-center gap-6'>
          <nav className='flex items-center gap-2' aria-label='관리자 메뉴'>
            {NAV_ITEMS.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-lg px-4 py-2.5 text-[16px] whitespace-nowrap',
                    active ? 'font-bold text-[#101828]' : 'text-[#667085] hover:text-[#101828]'
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div ref={menuRef} className='relative'>
            <button
              type='button'
              aria-haspopup='menu'
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className='flex items-center gap-2.5 rounded-full py-1.5 pr-3 pl-1.5 hover:text-[#667085]'
            >
              <span className='flex size-10 items-center justify-center rounded-full bg-[#F2F4F7] text-[#667085]'>
                <User size={22} aria-hidden />
              </span>
              <span className='text-[16px] font-bold text-[#101828]'>관리자님</span>
            </button>

            {open && (
              <div
                role='menu'
                className='absolute right-0 mt-2 w-40 rounded-lg border border-[#EAECF0] bg-white p-1.5 shadow-lg'
              >
                <form action={logoutAction}>
                  <button
                    type='submit'
                    role='menuitem'
                    className='w-full rounded-md px-3 py-2.5 text-left text-[15px] text-[#101828] hover:text-[#667085]'
                  >
                    로그아웃
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
