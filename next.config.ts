import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lohanrajo-admin.netlify.app',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3005',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*(.svg|.jpg|.jpeg|.png|.webp|.avif|.mp4|.webm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async rewrites() {
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || (process.env.NODE_ENV === 'production' ? 'https://lohanrajo-admin.netlify.app' : 'http://localhost:3005');
    return {
      fallback: [
        {
          source: '/uploads/:path*',
          destination: `${adminUrl}/uploads/:path*`,
        },
        {
          source: '/api/blobs/:path*',
          destination: `${adminUrl}/api/blobs/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
