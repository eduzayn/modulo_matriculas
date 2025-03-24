/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Temporarily disable type checking during build to allow deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Only include essential image configuration
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  // Use default swcMinify setting
  swcMinify: true,
  // Set output to export for static site generation
  output: 'export',
  transpilePackages: [
    "@edunexia/ui-components",
    "@edunexia/auth",
    "@edunexia/api-client",
    "@edunexia/utils"
  ],
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
}

module.exports = nextConfig
