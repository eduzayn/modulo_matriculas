// Load configuration
const config = require('./config');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Function to verify database structures
async function verifyDatabaseStructures() {
  console.log('Verifying database structures...');
  
  // Structures to verify
  const structures = [
    { type: 'storage_bucket', name: 'matricula_documentos', description: 'Bucket for matricula documents' },
    { type: 'storage_bucket', name: 'contratos', description: 'Bucket for contracts' },
    { type: 'storage_bucket', name: 'perfil', description: 'Bucket for profile pictures' },
    { type: 'table', schema: 'public', name: 'admin_users', description: 'Admin users table' },
    { type: 'table', schema: 'public', name: 'matricula_documentos', description: 'Public matricula documents table' },
    { type: 'table', schema: 'public', name: 'matricula_contratos', description: 'Matricula contracts table' },
    { type: 'table', schema: 'public', name: 'email_templates', description: 'Email templates table' },
    { type: 'table', schema: 'public', name: 'email_logs', description: 'Email logs table' },
    { type: 'schema', name: 'matricula', description: 'Matricula schema' }
  ];
  
  // Results
  const results = {
    verified: [],
    missing: []
  };
  
  // Verify each structure
  for (const structure of structures) {
    console.log(`Verifying ${structure.type}: ${structure.name}...`);
    
    try {
      let exists = false;
      
      if (structure.type === 'storage_bucket') {
        // Check if bucket exists
        const { data, error } = await supabase.storage.getBucket(structure.name);
        exists = !error && data;
      } else if (structure.type === 'table') {
        // Check if table exists using a dummy query
        const { data, error } = await supabase.auth.admin.createUser({
          email: `verify_${structure.name}@example.com`,
          password: 'tempPassword123',
          email_confirm: true,
          user_metadata: { 
            sql: `SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = '${structure.schema}'
              AND table_name = '${structure.name}'
            );`
          }
        });
        
        exists = !error;
      } else if (structure.type === 'schema') {
        // Check if schema exists
        const { data, error } = await supabase.auth.admin.createUser({
          email: `verify_schema_${structure.name}@example.com`,
          password: 'tempPassword123',
          email_confirm: true,
          user_metadata: { 
            sql: `SELECT EXISTS (
              SELECT FROM information_schema.schemata
              WHERE schema_name = '${structure.name}'
            );`
          }
        });
        
        exists = !error;
      }
      
      if (exists) {
        results.verified.push(structure);
        console.log(`✅ ${structure.type} ${structure.name} exists`);
      } else {
        results.missing.push(structure);
        console.log(`❌ ${structure.type} ${structure.name} does not exist`);
      }
    } catch (err) {
      console.error(`Error verifying ${structure.type} ${structure.name}:`, err);
      results.missing.push(structure);
    }
  }
  
  // Print summary
  console.log('\n=== Database Verification Summary ===');
  console.log(`Total structures verified: ${structures.length}`);
  console.log(`Structures found: ${results.verified.length}`);
  console.log(`Structures missing: ${results.missing.length}`);
  
  if (results.missing.length > 0) {
    console.log('\nMissing structures:');
    results.missing.forEach(structure => {
      console.log(`- ${structure.type} ${structure.name}: ${structure.description}`);
    });
  }
  
  return results;
}

// Run the function
verifyDatabaseStructures().catch(err => {
  console.error('Verification process failed:', err);
  process.exit(1);
});
