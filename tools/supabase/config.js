// Configuration for Supabase tools
// In production, these values should be loaded from environment variables

// Load environment variables
require('dotenv').config();

// Export configuration
module.exports = {
  // Supabase credentials
  supabaseUrl: process.env.SUPABASE_URL || 'https://uasnyifizdjxogowijip.supabase.co',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY', // Replace in production
  
  // Email configuration
  smtpHost: process.env.SMTP_HOST || 'brasil.svrdedicado.org',
  smtpPort: process.env.SMTP_PORT || 587,
  smtpUser: process.env.SMTP_USER || 'contato@eduzayn.com.br',
  smtpPass: process.env.SMTP_PASS || 'YOUR_SMTP_PASSWORD', // Replace in production
  
  // Database migration files
  migrationFiles: [
    { path: '../../migrations/storage/create_buckets.sql', description: 'Create Storage Buckets' },
    { path: '../../migrations/20250310_matricula_schema.sql', description: 'Create Matricula Schema' },
    { path: '../../migrations/20250310_admin_users.sql', description: 'Create Admin Users Table' },
    { path: '../../migrations/20250310_matricula_documentos.sql', description: 'Create Matricula Documentos Table' },
    { path: '../../migrations/20250310_matricula_contratos.sql', description: 'Create Matricula Contratos Table' },
    { path: '../../migrations/20250310_email_tables.sql', description: 'Create Email Tables' }
  ]
};
