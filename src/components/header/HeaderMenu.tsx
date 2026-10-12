'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

type MenuItem = { id: string; label: string; href: string };

const MENU_ITEMS: MenuItem[] = [
  { id: 'about', label: '회사 소개', href: '/about' },
  {
    id: 'products',
    label: '제품 소개',
    href: '/products',
  },
  { id: 'contact', label: '고객 문의', href: '/inquiry' },
];

export default function HeaderMenu() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav ref={menuRef} className='flex items-center gap-8'>
      <ul className='hidden items-center gap-[clamp(1.5rem,8vw,5.5rem)] md:flex'>
        {MENU_ITEMS.map((item) => {
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className='lg:text-md font-semibold text-gray-200 hover:text-white active:text-white'
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ── 모바일 햄버거 버튼 ── */}
      <button
        onClick={() => setIsMobileOpen((prev) => !prev)}
        aria-expanded={isMobileOpen}
        aria-label={isMobileOpen ? '메뉴 닫기' : '메뉴 열기'}
        className='text-white md:hidden'
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* ── 모바일 메뉴 ── */}
      {isMobileOpen && (
        <div className='absolute top-full left-0 z-50 w-full border-t border-white/10 bg-[#0E2447] md:hidden'>
          <ul className='flex flex-col px-8 py-4'>
            {MENU_ITEMS.map((item) => {
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className='block py-3 text-sm text-gray-200 hover:text-white active:text-white'
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
