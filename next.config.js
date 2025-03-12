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
    domains: ['example.supabase.co', 'edunexia.com', 'uasnyifizdjxogowijip.supabase.co'],
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
