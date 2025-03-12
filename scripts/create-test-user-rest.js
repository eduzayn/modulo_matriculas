// Script to create a test user in Supabase using the REST API
const https = require('https');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration with provided credentials
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

// Function to make HTTPS requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ statusCode: res.statusCode, data: parsedData });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function createTestUser() {
  try {
    console.log('Criando usuário de teste via REST API...');
    
    // Create user using the Admin API
    const createOptions = {
      hostname: 'uasnyifizdjxogowijip.supabase.co',
      path: '/auth/v1/admin/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    };
    
    const createData = {
      email: testUser.email,
      password: testUser.password,
      email_confirm: true,
      user_metadata: testUser.user_metadata
    };
    
    const response = await makeRequest(createOptions, createData);
    
    if (response.statusCode !== 200 && response.statusCode !== 201) {
      if (response.data && response.data.msg && response.data.msg.includes('already exists')) {
        console.log('Usuário já existe. Tentando atualizar...');
        
        // Get user by email
        const getUserOptions = {
          hostname: 'uasnyifizdjxogowijip.supabase.co',
          path: `/auth/v1/admin/users?email=${encodeURIComponent(testUser.email)}`,
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        };
        
        const getUserResponse = await makeRequest(getUserOptions);
        
        if (getUserResponse.statusCode !== 200 || !getUserResponse.data || getUserResponse.data.length === 0) {
          console.error('Erro ao buscar usuário:', getUserResponse.data);
          return;
        }
        
        const userId = getUserResponse.data[0].id;
        
        // Update user metadata
        const updateOptions = {
          hostname: 'uasnyifizdjxogowijip.supabase.co',
          path: `/auth/v1/admin/users/${userId}`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        };
        
        const updateData = {
          user_metadata: testUser.user_metadata
        };
        
        const updateResponse = await makeRequest(updateOptions, updateData);
        
        if (updateResponse.statusCode !== 200) {
          console.error('Erro ao atualizar usuário:', updateResponse.data);
          return;
        }
        
        console.log('Usuário atualizado com sucesso!');
        console.log('Email:', testUser.email);
        console.log('Senha:', testUser.password);
        console.log('Role:', testUser.user_metadata.role);
        return;
      }
      
      console.error('Erro ao criar usuário:', response.data);
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
