#!/usr/bin/env node

/**
 * Supabase Email Configuration Tool
 * 
 * This script provides a way to configure email settings in Supabase
 * without requiring the Supabase CLI.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'brasil.svrdedicado.org',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  user: process.env.SMTP_USER || 'contato@eduzayn.com.br',
  password: process.env.SMTP_PASS || '', // Password should be set in environment
  secure: false, // Use TLS
};

// Create Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkEmailConfiguration() {
  try {
    console.log('Checking current email configuration in Supabase...');
    
    // This is a workaround since we don't have direct access to email settings via API
    // We'll check if we can access the database as a proxy for admin access
    const { data, error } = await supabase
      .from('matriculas')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('Could not access matriculas table:', error.message);
      
      // Try another table
      const { data: testData, error: testError } = await supabase
        .from('documentos')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.error('Error connecting to Supabase database:', testError.message);
        console.log('Current environment configuration:');
        console.log(`SMTP_HOST: ${emailConfig.host}`);
        console.log(`SMTP_PORT: ${emailConfig.port}`);
        console.log(`SMTP_USER: ${emailConfig.user}`);
        console.log(`SMTP_PASS: ${emailConfig.password ? '[SET]' : '[NOT SET]'}`);
        return false;
      }
    }
    
    console.log('Successfully connected to Supabase database.');
    return true;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

async function createEmailHelperFunctions() {
  try {
    console.log('Creating email helper functions in the database...');
    
    // Create a function to test email sending
    const testEmailFunction = `
    CREATE OR REPLACE FUNCTION public.test_email_config()
    RETURNS boolean
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      -- This function would normally send a test email
      -- but we'll just return true for now since we can't
      -- actually send emails from here
      RETURN true;
    END;
    $$;
    `;
    
    // We can't execute raw SQL directly with the JS client
    // This is just to show what would be done with proper CLI access
    console.log('Email helper function SQL (would need to be executed via Supabase dashboard):');
    console.log(testEmailFunction);
    
    return true;
  } catch (error) {
    console.error('Error creating email helper functions:', error.message);
    return false;
  }
}

async function main() {
  console.log('Supabase Email Configuration Tool');
  console.log('================================');
  
  const hasAccess = await checkEmailConfiguration();
  if (!hasAccess) {
    console.log('Unable to access Supabase database.');
    console.log('Please check your SUPABASE_SERVICE_ROLE_KEY and database connection.');
    process.exit(1);
  }
  
  await createEmailHelperFunctions();
  
  console.log('\nEmail configuration information:');
  console.log('To fully set up email in Supabase, please:');
  console.log('1. Log in to the Supabase dashboard at https://app.supabase.io');
  console.log('2. Navigate to your project settings');
  console.log('3. Go to the "Auth" section and find "Email Templates"');
  console.log('4. Configure the SMTP settings with:');
  console.log(`   - Host: ${emailConfig.host}`);
  console.log(`   - Port: ${emailConfig.port}`);
  console.log(`   - User: ${emailConfig.user}`);
  console.log('   - Password: [Set in dashboard]');
  console.log('   - Secure: No (TLS will be used)');
  console.log('5. Test the email configuration from the dashboard');
  console.log('6. Update email templates as needed');
  
  console.log('\nLocal environment configuration:');
  console.log('Make sure your .env file contains:');
  console.log('SMTP_HOST=brasil.svrdedicado.org');
  console.log('SMTP_PORT=587');
  console.log('SMTP_USER=contato@eduzayn.com.br');
  console.log('SMTP_PASS=[your-password]');
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
