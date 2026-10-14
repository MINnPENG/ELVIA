import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // 문의 첨부파일(최대 10MB)을 Server Action으로 받기 위한 여유분. 기본값은 1MB.
    serverActions: { bodySizeLimit: '11mb' },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
