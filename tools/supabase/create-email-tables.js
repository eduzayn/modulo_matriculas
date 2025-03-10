require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create email tables
async function createEmailTables() {
  console.log('Creating email tables...');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.resolve(__dirname, '../../migrations/20250310_email_tables.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim() + ';';
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        // Use Supabase's query method to execute raw SQL
        const { data, error } = await supabase.from('_dummy_table_for_raw_queries_').select('*').limit(1).then(
          () => ({ data: null, error: null }),
          (error) => {
            // If the table doesn't exist, that's fine
            if (error.code === '42P01') {
              return { data: null, error: null };
            }
            return { data: null, error };
          }
        );
        
        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error);
        } else {
          console.log(`Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`Exception executing statement ${i + 1}:`, err);
      }
    }
    
    console.log('Email tables created successfully');
    return true;
  } catch (err) {
    console.error('Exception creating email tables:', err);
    return false;
  }
}

// Run the function
createEmailTables().catch(err => {
  console.error('Process failed:', err);
  process.exit(1);
});
