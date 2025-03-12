// Simple script to create a test user in Supabase using the JS SDK
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration with provided credentials
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'sbp_057451a19b2fcdc89fc94ac28289e321ffc6e6a0'; // Service role key

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test user details
const testUser = {
  email: 'teste@edunexia.com.br',
  password: 'Teste@123'
};

async function createTestUser() {
  try {
    console.log('Criando usuário de teste...');
    
    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: 'Usuário de Teste',
          role: 'admin'
        }
      }
    });

    if (error) {
      console.error('Erro ao criar usuário:', error.message);
      return;
    }

    console.log('Usuário criado com sucesso!');
    console.log('Email:', testUser.email);
    console.log('Senha:', testUser.password);
    console.log('User ID:', data.user.id);
    
  } catch (error) {
    console.error('Erro inesperado:', error.message);
  }
}

// Execute the function
createTestUser();
