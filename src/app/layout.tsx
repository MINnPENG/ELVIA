import localFont from 'next/font/local';
import Header from '@/components/header/Header';
import './globals.css';
import type { ReactNode } from 'react';
import Footer from '@/components/footer/Footer';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko' className={pretendard.variable}>
      <body className={`${pretendard.className} flex min-h-screen flex-col`}>
        <Header />
        <main className='flex-1'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
