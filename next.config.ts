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
    return {
      fallback: [
        {
          source: '/uploads/:path*',
          destination: 'http://localhost:3005/uploads/:path*',
        },
        {
          source: '/api/blobs/:path*',
          destination: 'http://localhost:3005/api/blobs/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
