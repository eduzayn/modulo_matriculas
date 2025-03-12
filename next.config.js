const withNextIntl = require('next-intl/plugin')('./app/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  // Configuração para permitir imagens de domínios externos
  images: {
    domains: ['example.supabase.co', 'edunexia.com'],
  },
  // Configuração para lidar com erros de servidor
  onDemandEntries: {
    // Período que a página deve permanecer em buffer
    maxInactiveAge: 25 * 1000,
    // Número de páginas que devem ser mantidas em buffer
    pagesBufferLength: 4,
  }
}

module.exports = withNextIntl(nextConfig);
