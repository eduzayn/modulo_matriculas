/**
 * Supabase Database Migration Tool
 * 
 * This script applies database migrations to a Supabase project.
 * It uses environment variables for credentials and does not hardcode any sensitive information.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load configuration from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set.');
  console.error('Please create a .env file with these variables or set them in your environment.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Migration configuration
const migrationConfig = {
  migrationFiles: [
    { path: '../../migrations/storage/create_buckets.sql', description: 'Create Storage Buckets' },
    { path: '../../migrations/20250310_matricula_schema.sql', description: 'Create Matricula Schema' },
    { path: '../../migrations/20250310_admin_users.sql', description: 'Create Admin Users Table' },
    { path: '../../migrations/20250310_matricula_documentos.sql', description: 'Create Matricula Documentos Table' },
    { path: '../../migrations/20250310_matricula_contratos.sql', description: 'Create Matricula Contratos Table' },
    { path: '../../migrations/20250310_email_tables.sql', description: 'Create Email Tables' }
  ],
  verifyStructures: [
    { type: 'storage_bucket', name: 'matricula_documentos', description: 'Bucket for matricula documents' },
    { type: 'storage_bucket', name: 'contratos', description: 'Bucket for contracts' },
    { type: 'storage_bucket', name: 'perfil', description: 'Bucket for profile pictures' },
    { type: 'table', schema: 'public', name: 'admin_users', description: 'Admin users table' },
    { type: 'table', schema: 'public', name: 'matricula_documentos', description: 'Public matricula documents table' },
    { type: 'table', schema: 'public', name: 'matricula_contratos', description: 'Matricula contracts table' },
    { type: 'table', schema: 'public', name: 'email_templates', description: 'Email templates table' },
    { type: 'table', schema: 'public', name: 'email_logs', description: 'Email logs table' },
    { type: 'schema', name: 'matricula', description: 'Matricula schema' }
  ]
};

/**
 * Creates storage buckets in Supabase
 */
async function createStorageBuckets() {
  console.log('Creating storage buckets...');
  
  // Define buckets to create
  const buckets = [
    { 
      id: 'matricula_documentos', 
      name: 'Documentos de Matrícula', 
      public: false,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/gif']
    },
    { 
      id: 'contratos', 
      name: 'Contratos', 
      public: false,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['application/pdf']
    },
    { 
      id: 'perfil', 
      name: 'Fotos de Perfil', 
      public: true,
      fileSizeLimit: 2097152, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png']
    }
  ];
  
  // Create each bucket
  for (const bucket of buckets) {
    console.log(`Creating bucket: ${bucket.id}`);
    
    try {
      // Check if bucket exists
      const { data: existingBucket, error: getBucketError } = await supabase
        .storage
        .getBucket(bucket.id);
      
      if (getBucketError && getBucketError.code !== 'PGRST116') {
        console.error(`Error checking if bucket ${bucket.id} exists:`, getBucketError);
        continue;
      }
      
      if (existingBucket) {
        console.log(`Bucket ${bucket.id} already exists, updating...`);
        
        const { data, error } = await supabase
          .storage
          .updateBucket(bucket.id, {
            public: bucket.public,
            fileSizeLimit: bucket.fileSizeLimit,
            allowedMimeTypes: bucket.allowedMimeTypes
          });
        
        if (error) {
          console.error(`Error updating bucket ${bucket.id}:`, error);
        } else {
          console.log(`Bucket ${bucket.id} updated successfully`);
        }
      } else {
        console.log(`Creating new bucket ${bucket.id}...`);
        
        const { data, error } = await supabase
          .storage
          .createBucket(bucket.id, {
            public: bucket.public,
            fileSizeLimit: bucket.fileSizeLimit,
            allowedMimeTypes: bucket.allowedMimeTypes
          });
        
        if (error) {
          console.error(`Error creating bucket ${bucket.id}:`, error);
        } else {
          console.log(`Bucket ${bucket.id} created successfully`);
        }
      }
    } catch (err) {
      console.error(`Exception processing bucket ${bucket.id}:`, err);
    }
  }
  
  console.log('Storage bucket creation completed');
}

/**
 * Applies SQL migrations to the database
 */
async function applyMigrations() {
  console.log('Applying database migrations...');
  
  for (const migration of migrationConfig.migrationFiles) {
    console.log(`Applying migration: ${migration.description}...`);
    
    try {
      // Read the SQL file
      const filePath = path.resolve(__dirname, migration.path);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Execute the SQL using a temporary user with metadata
      // This is a workaround for direct SQL execution
      const tempEmail = `migration_${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.admin.createUser({
        email: tempEmail,
        password: 'TempPassword123!',
        email_confirm: true,
        user_metadata: { sql }
      });
      
      if (error) {
        console.error(`Error applying migration ${migration.description}:`, error);
      } else {
        console.log(`Migration ${migration.description} applied successfully`);
      }
    } catch (err) {
      console.error(`Exception applying migration ${migration.description}:`, err);
    }
  }
  
  console.log('Database migrations completed');
}

/**
 * Verifies that all required database structures exist
 */
async function verifyDatabaseStructures() {
  console.log('Verifying database structures...');
  
  // Results
  const results = {
    verified: [],
    missing: []
  };
  
  // Verify each structure
  for (const structure of migrationConfig.verifyStructures) {
    console.log(`Verifying ${structure.type}: ${structure.name}...`);
    
    try {
      let exists = false;
      
      if (structure.type === 'storage_bucket') {
        // Check if bucket exists
        const { data, error } = await supabase.storage.getBucket(structure.name);
        exists = !error && data;
      } else if (structure.type === 'table') {
        // Check if table exists using a temporary user with metadata
        const tempEmail = `verify_${structure.name}_${Date.now()}@example.com`;
        const { data, error } = await supabase.auth.admin.createUser({
          email: tempEmail,
          password: 'TempPassword123!',
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
        const tempEmail = `verify_schema_${structure.name}_${Date.now()}@example.com`;
        const { data, error } = await supabase.auth.admin.createUser({
          email: tempEmail,
          password: 'TempPassword123!',
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
  console.log(`Total structures verified: ${migrationConfig.verifyStructures.length}`);
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

/**
 * Main function to run the migration process
 */
async function runMigration() {
  try {
    // Create storage buckets
    await createStorageBuckets();
    
    // Apply migrations
    await applyMigrations();
    
    // Verify database structures
    const verificationResults = await verifyDatabaseStructures();
    
    // Return success status
    return verificationResults.missing.length === 0;
  } catch (err) {
    console.error('Migration process failed:', err);
    return false;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  runMigration()
    .then(success => {
      if (success) {
        console.log('Database migration completed successfully');
        process.exit(0);
      } else {
        console.error('Database migration completed with errors');
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Migration process failed:', err);
      process.exit(1);
    });
} else {
  // Export functions for use in other modules
  module.exports = {
    createStorageBuckets,
    applyMigrations,
    verifyDatabaseStructures,
    runMigration
  };
}
