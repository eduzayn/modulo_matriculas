const fs = require('fs');
const path = require('path');
const { executeSql } = require('./supabase-api');

// Function to read and execute SQL file
async function executeSqlFile(filePath, description) {
  console.log(`Executing ${description}...`);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    const result = await executeSql(sql);
    
    if (result.success) {
      console.log(`Successfully executed ${description}`);
      return true;
    } else {
      console.error(`Failed to execute ${description}:`, result.error);
      return false;
    }
  } catch (error) {
    console.error(`Error reading or executing ${description}:`, error);
    return false;
  }
}

// Main function to apply all migrations
async function applyMigrations() {
  // Migration files in order of execution
  const migrationFiles = [
    { path: '../../migrations/storage/create_buckets.sql', description: 'Create Storage Buckets' },
    { path: '../../migrations/20250310_matricula_schema.sql', description: 'Create Matricula Schema' },
    { path: '../../migrations/20250310_admin_users.sql', description: 'Create Admin Users Table' },
    { path: '../../migrations/20250310_matricula_documentos.sql', description: 'Create Matricula Documentos Table' },
    { path: '../../migrations/20250310_matricula_contratos.sql', description: 'Create Matricula Contratos Table' }
  ];
  
  // Execute each migration file
  for (const migration of migrationFiles) {
    const filePath = path.resolve(__dirname, migration.path);
    const success = await executeSqlFile(filePath, migration.description);
    
    if (!success) {
      console.error(`Migration failed: ${migration.description}`);
      process.exit(1);
    }
  }
  
  console.log('All migrations applied successfully!');
}

// Run the migrations
applyMigrations().catch(error => {
  console.error('Migration process failed:', error);
  process.exit(1);
});
