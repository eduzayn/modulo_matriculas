require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Create matricula schema
async function createMatriculaSchema() {
  console.log('Creating matricula schema...');
  
  try {
    const { data, error } = await supabase
      .from('_rpc')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return false;
    }
    
    // Create schema using raw SQL
    const { error: schemaError } = await supabase.auth.admin.createUser({
      email: 'schema_creator@example.com',
      password: 'tempPassword123',
      email_confirm: true,
      user_metadata: { 
        sql: 'CREATE SCHEMA IF NOT EXISTS matricula;' 
      }
    });
    
    if (schemaError) {
      console.error('Error creating schema:', schemaError);
      return false;
    }
    
    console.log('Matricula schema created successfully');
    return true;
  } catch (err) {
    console.error('Exception creating schema:', err);
    return false;
  }
}

// Run the function
createMatriculaSchema().catch(err => {
  console.error('Process failed:', err);
  process.exit(1);
});
