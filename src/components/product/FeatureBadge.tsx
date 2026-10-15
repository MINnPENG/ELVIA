'use client';

import { Check } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import type { FeatureView } from '@/lib/products/types';

const VIEWPORT_MARGIN = 8;

/**
 * 주요 기능 하나를 원형 배지(아이콘 + 이름)로 보여주고,
 * 마우스를 올리거나 탭/포커스하면 검은 말풍선으로 설명을 보여준다.
 */
export default function FeatureBadge({ feature }: { feature: FeatureView }) {
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);

  // 열기 직전에 말풍선이 화면 밖으로 나가는지 재서, 나가면 안쪽으로 민다.
  const show = () => {
    const el = tooltipRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const left = rect.left - shift;
      const right = rect.right - shift;
      const viewport = document.documentElement.clientWidth;
      if (left < VIEWPORT_MARGIN) setShift(VIEWPORT_MARGIN - left);
      else if (right > viewport - VIEWPORT_MARGIN) setShift(viewport - VIEWPORT_MARGIN - right);
      else setShift(0);
    }
    setOpen(true);
  };
  const hide = () => setOpen(false);

  // 터치 화면에는 hover 가 없으므로, 열려 있는 동안 바깥을 누르거나 Esc 를 누르면 닫는다.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
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

  const visibility = open ? 'visible opacity-100' : 'invisible opacity-0';

  return (
    <div
      ref={wrapperRef}
      className='relative aspect-square max-w-22 min-w-16 flex-1 basis-0 self-start'
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        type='button'
        aria-describedby={tooltipId}
        onFocus={show}
        onBlur={hide}
        onClick={show}
        className={`flex aspect-square w-full cursor-default flex-col items-center justify-center gap-1 rounded-full border bg-[#FFFFFF] px-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#1F61C7] focus-visible:ring-offset-1 focus-visible:outline-none ${
          open ? 'border-[#1F61C7]' : 'border-[#DBE0E8]'
        }`}
      >
        {feature.icon ? (
          // SVG 는 next/image 가 최적화하지 않으므로 그대로 불러온다.
          <Image src={feature.icon} width={28} height={28} alt='' unoptimized />
        ) : (
          <Check size={26} strokeWidth={1.75} color='#0F131A' aria-hidden />
        )}
        <span className='text-[11px] leading-tight font-bold break-keep text-[#0F131A]'>
          {feature.name}
        </span>
      </button>

      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-0.5 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-[#0F131A] transition-opacity ${visibility}`}
      />
      <span
        ref={tooltipRef}
        id={tooltipId}
        role='tooltip'
        style={{ transform: `translateX(${shift}px)` }}
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-52 -translate-x-1/2 rounded-md bg-[#0F131A] px-3 py-2 text-center text-[12px] leading-snug text-[#FFFFFF] shadow-lg transition-opacity ${visibility}`}
      >
        {feature.description}
      </span>
    </div>
  );
}
