/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['example.com', 'edunexia.com'],
  },
  swcMinify: true,
  staticPageGenerationTimeout: 120
}

module.exports = nextConfig
