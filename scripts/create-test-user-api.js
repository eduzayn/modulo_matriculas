// Script to create a test user in Supabase using the Admin API
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'sbp_057451a19b2fcdc89fc94ac28289e321ffc6e6a0'; // Service role key for admin operations

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
    console.log('Criando usuário de teste via API...');
    
    // Create user using the Admin API
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
        user_metadata: testUser.user_metadata
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (data.msg && data.msg.includes('already exists')) {
        console.log('Usuário já existe. Tentando atualizar...');
        
        // Get user by email
        const getUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(testUser.email)}`, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        const users = await getUserResponse.json();
        
        if (!getUserResponse.ok || !users || users.length === 0) {
          console.error('Erro ao buscar usuário:', users);
          return;
        }
        
        const userId = users[0].id;
        
        // Update user metadata
        const updateResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            user_metadata: testUser.user_metadata
          })
        });
        
        const updateData = await updateResponse.json();
        
        if (!updateResponse.ok) {
          console.error('Erro ao atualizar usuário:', updateData);
          return;
        }
        
        console.log('Usuário atualizado com sucesso!');
        console.log('Email:', testUser.email);
        console.log('Senha:', testUser.password);
        console.log('Role:', testUser.user_metadata.role);
        return;
      }
      
      console.error('Erro ao criar usuário:', data);
      return;
    }
    
    console.log('Usuário criado com sucesso!');
    console.log('Email:', testUser.email);
    console.log('Senha:', testUser.password);
    console.log('Role:', testUser.user_metadata.role);
    
  } catch (error) {
    console.error('Erro inesperado:', error.message);
  }
}

// Execute the function
createTestUser();
