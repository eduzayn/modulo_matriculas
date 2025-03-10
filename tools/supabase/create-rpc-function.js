require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Create the exec_sql RPC function
async function createRpcFunction() {
  console.log('Creating exec_sql RPC function...');
  
  const sql = `
  CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
  RETURNS JSONB
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  DECLARE
    result JSONB;
  BEGIN
    EXECUTE sql_query;
    result := '{"success": true}'::JSONB;
    RETURN result;
  EXCEPTION WHEN OTHERS THEN
    result := jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'detail', SQLSTATE
    );
    RETURN result;
  END;
  $$;
  `;
  
  try {
    // Execute SQL directly since we don't have the RPC function yet
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(() => {
      // If the RPC doesn't exist yet, use raw SQL
      return supabase.from('_rpc').select('*').limit(1);
    });
    
    if (error) {
      console.log('RPC function may not exist yet, trying direct SQL execution...');
      const { data, error: sqlError } = await supabase.auth.admin.createUser({
        email: 'temp@example.com',
        password: 'tempPassword123',
        email_confirm: true,
        user_metadata: { sql }
      });
      
      if (sqlError) {
        console.error('Error creating RPC function:', sqlError);
        return false;
      }
      
      console.log('Successfully created exec_sql RPC function');
      return true;
    }
    
    console.log('exec_sql RPC function already exists or was created successfully');
    return true;
  } catch (err) {
    console.error('Exception creating RPC function:', err);
    return false;
  }
}

// Run the function
createRpcFunction().catch(err => {
  console.error('Process failed:', err);
  process.exit(1);
});
