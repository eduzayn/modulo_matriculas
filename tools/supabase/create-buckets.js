require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create storage buckets
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

// Run the function
createStorageBuckets().catch(err => {
  console.error('Process failed:', err);
  process.exit(1);
});
