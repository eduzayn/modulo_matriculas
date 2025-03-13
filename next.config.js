/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    // This will completely ignore the case of the path
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components/ui/button': require('path').resolve('./components/ui/button'),
      '@/components/ui/badge': require('path').resolve('./components/ui/badge'),
      '@/components/ui/card': require('path').resolve('./components/ui/card'),
      '@/components/ui/input': require('path').resolve('./components/ui/input'),
      '@/components/ui/select': require('path').resolve('./components/ui/select'),
      '@/components/ui/textarea': require('path').resolve('./components/ui/textarea'),
      '@/components/ui/dialog': require('path').resolve('./components/ui/dialog'),
      '@/components/ui/tabs': require('path').resolve('./components/ui/tabs'),
    };
    return config;
  },
};

module.exports = nextConfig;
