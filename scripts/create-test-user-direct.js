// Script to create a test user in Supabase using the provided credentials
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration with provided credentials
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'sbp_057451a19b2fcdc89fc94ac28289e321ffc6e6a0'; // Service role key for admin operations

// Create Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test user details
const testUser = {
  email: 'teste@edunexia.com.br',
  password: 'Teste@123',
  user_metadata: {
    full_name: 'Usuário de Teste',
    role: 'admin'
  }
};

async function createTestUser() {
  try {
    console.log('Criando usuário de teste...');
    
    // Create user with admin client
    const { data, error } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: testUser.user_metadata
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('Usuário já existe. Tentando atualizar...');
        
        // Get user by email
        const { data: users, error: searchError } = await supabase.auth.admin.listUsers({
          filter: `email.eq.${testUser.email}`
        });
        
        if (searchError || !users || users.length === 0) {
          console.error('Erro ao buscar usuário:', searchError?.message || 'Usuário não encontrado');
          return;
        }
        
        const userId = users[0].id;
        
        // Update user metadata
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
          userId,
          { user_metadata: testUser.user_metadata }
        );
        
        if (updateError) {
          console.error('Erro ao atualizar usuário:', updateError.message);
          return;
        }
        
        console.log('Usuário atualizado com sucesso!');
        console.log('Email:', testUser.email);
        console.log('Senha:', testUser.password);
        console.log('Role:', testUser.user_metadata.role);
        return;
      }
      
      console.error('Erro ao criar usuário:', error.message);
      return;
    }

    console.log('Usuário criado com sucesso!');
    console.log('Email:', data.user.email);
    console.log('Senha:', testUser.password);
    console.log('Role:', testUser.user_metadata.role);
    
  } catch (error) {
    console.error('Erro inesperado:', error.message);
  }
}

// Execute the function
createTestUser();
