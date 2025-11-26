import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during build (optional)
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    ...(process.env.DISABLE_CACHE === 'true' && {
      serverActions: {
        bodySizeLimit: '2mb',
      },
    }),
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Cache control headers
  headers: async () => {
    if (process.env.DISABLE_CACHE === 'true' || process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
            {
              key: 'Pragma',
              value: 'no-cache',
            },
            {
              key: 'Expires',
              value: '0',
            },
          ],
        },
      ];
    }
    return [];
  },

  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,
  

  images: {
    domains: ['res.cloudinary.com', 'picsum.photos'],
    formats: ['image/webp', 'image/avif'],
  },

  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            mui: {
              test: /[\\/]node_modules[\\/]@mui[\\/]/,
              name: 'mui',
              chunks: 'all',
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
