// Script to create a test user in Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables.');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Initialize Supabase admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test user details
const email = 'teste@eduzayn.com.br';
const password = 'senha123';
const userData = {
  role: 'admin', // or 'user' depending on permissions needed
  name: 'Usuário de Teste'
};

async function createTestUser() {
  try {
    // Create user with admin client
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: userData
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return;
    }

    console.log('Test user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', data.user.id);
    console.log('\nYou can now log in with these credentials at /auth/login');
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

createTestUser();
