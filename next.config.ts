import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
  },
};

export default nextConfig;
