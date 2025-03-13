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
    // Handle case sensitivity issues
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Make module resolution case-insensitive
    const origTest = config.module.rules[1].oneOf[2].test;
    config.module.rules[1].oneOf[2].test = function(path) {
      return origTest.test(path.toLowerCase());
    };
    
    return config;
  },
};

module.exports = nextConfig;
