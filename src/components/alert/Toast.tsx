'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

type ToastType = 'success' | 'info' | 'error';

interface ToastOptions {
  type: ToastType;
  title: string;
  message: string;
}

interface ToastItem extends ToastOptions {
  id: number;
}

const STYLE: Record<ToastType, { box: string; title: string }> = {
  success: { box: 'bg-[#ECFDF3]', title: 'text-[#087A55]' },
  info: { box: 'bg-[#EFF4FF]', title: 'text-[#2F6FDD]' },
  error: { box: 'bg-[#FFF1F0]', title: 'text-[#D92D20]' },
};

const ToastContext = createContext<{ show: (options: ToastOptions) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const show = useCallback((options: ToastOptions) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, ...options }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live='polite'
        className='w-30% pointer-events-none fixed inset-x-0 bottom-6 z-50 mx-auto flex max-w-7xl flex-col gap-2 p-4'
      >
        {toasts.map(({ id, type, title, message }) => (
          <div
            key={id}
            role={type === 'error' ? 'alert' : 'status'}
            className={cn('flex items-center gap-10 rounded-[10px] p-4', STYLE[type].box)}
          >
            <strong className={cn('w-16 shrink-0 text-[14px] font-bold', STYLE[type].title)}>
              {title}
            </strong>
            <span className={cn('text-[12px]', STYLE[type].title)}>{message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast는 ToastProvider 안에서 사용해야 합니다.');
  return ctx;
}
