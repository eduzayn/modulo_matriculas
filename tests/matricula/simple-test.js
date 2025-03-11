// Simple test script for matricula module
// Author: Devin AI
// Date: 11/03/2025

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runSimpleTest() {
  console.log('🚀 Running simple test for matricula module...');
  
  try {
    // 1. Create test student
    console.log('Creating test student...');
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        name: `Test Student ${Date.now()}`,
        email: `test${Date.now()}@example.com`
      })
      .select('id')
      .single();
    
    if (studentError) {
      console.error('Failed to create student:', studentError);
      return;
    }
    console.log(`Created student with ID: ${student.id}`);
    
    // 2. Create test course
    console.log('Creating test course...');
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        name: `Test Course ${Date.now()}`,
        title: `Test Course Title ${Date.now()}`,
        description: 'Test course description',
        price: 1000.00
      })
      .select('id')
      .single();
    
    if (courseError) {
      console.error('Failed to create course:', courseError);
      return;
    }
    console.log(`Created course with ID: ${course.id}`);
    
    // 3. Create matricula directly with SQL
    console.log('Creating matricula with SQL...');
    const { data: sqlResult, error: sqlError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO matricula.registros 
        (aluno_id, curso_id, status, forma_pagamento, numero_parcelas, metadata)
        VALUES 
        ('${student.id}', '${course.id}', 'pendente', 'cartao_credito', 12, '{"source":"simple_test"}'::jsonb)
        RETURNING id
      `
    });
    
    if (sqlError) {
      console.error('Failed to create matricula with SQL:', sqlError);
      return;
    }
    console.log('SQL Result:', sqlResult);
    
    // 4. Create matricula with Supabase client
    console.log('Creating matricula with Supabase client...');
    const { data: matricula, error: matriculaError } = await supabase
      .from('matricula.registros')
      .insert({
        aluno_id: student.id,
        curso_id: course.id,
        status: 'pendente',
        forma_pagamento: 'cartao_credito',
        numero_parcelas: 12,
        metadata: { source: 'simple_test_client' }
      })
      .select('id')
      .single();
    
    if (matriculaError) {
      console.error('Failed to create matricula with Supabase client:', matriculaError);
      
      // Try alternative approach
      console.log('Trying alternative approach...');
      const { data: altMatricula, error: altError } = await supabase
        .from('matricula.registros')
        .insert([{
          aluno_id: student.id,
          curso_id: course.id,
          status: 'pendente',
          forma_pagamento: 'cartao_credito',
          numero_parcelas: 12,
          metadata: { source: 'simple_test_alt' }
        }])
        .select();
      
      if (altError) {
        console.error('Alternative approach failed:', altError);
      } else {
        console.log('Alternative approach succeeded:', altMatricula);
      }
      
      return;
    }
    
    console.log(`Created matricula with ID: ${matricula.id}`);
    
    console.log('✅ Simple test completed successfully!');
  } catch (error) {
    console.error('Error in simple test:', error);
  }
}

// Run the test
runSimpleTest();
