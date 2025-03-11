/**
 * Test script for core functionality of the Matricula module
 */

// Test database connection
async function testDatabaseConnection() {
  console.log('Testing database connection...');
  try {
    const response = await fetch('https://uasnyifizdjxogowijip.supabase.co/rest/v1/rpc/exec_sql', {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: "SELECT current_database(), current_user"
      })
    });
    
    const data = await response.json();
    console.log('Database connection result:', data);
    return data.success === true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Test student creation
async function testStudentCreation() {
  console.log('Testing student creation...');
  try {
    const testStudent = {
      name: 'Aluno Teste ' + Date.now(),
      email: 'aluno' + Date.now() + '@teste.com'
    };
    
    const response = await fetch('https://uasnyifizdjxogowijip.supabase.co/rest/v1/students', {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testStudent)
    });
    
    const data = await response.json();
    console.log('Student creation result:', data);
    return data[0]?.id != null;
  } catch (error) {
    console.error('Student creation error:', error);
    return false;
  }
}

// Test course creation
async function testCourseCreation() {
  console.log('Testing course creation...');
  try {
    const testCourse = {
      title: 'Curso Teste ' + Date.now(),
      description: 'Descrição do curso de teste',
      price: 1000.00
    };
    
    const response = await fetch('https://uasnyifizdjxogowijip.supabase.co/rest/v1/courses', {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testCourse)
    });
    
    const data = await response.json();
    console.log('Course creation result:', data);
    return data[0]?.id != null;
  } catch (error) {
    console.error('Course creation error:', error);
    return false;
  }
}

// Test matricula creation
async function testMatriculaCreation() {
  console.log('Testing matricula creation...');
  try {
    // First get a student and course
    const studentResponse = await fetch('https://uasnyifizdjxogowijip.supabase.co/rest/v1/students?limit=1', {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    const students = await studentResponse.json();
    if (!students || students.length === 0) {
      console.error('No students found');
      return false;
    }
    
    const courseResponse = await fetch('https://uasnyifizdjxogowijip.supabase.co/rest/v1/courses?limit=1', {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });
    
    const courses = await courseResponse.json();
    if (!courses || courses.length === 0) {
      console.error('No courses found');
      return false;
    }
    
    const testMatricula = {
      aluno_id: students[0].id,
      curso_id: courses[0].id,
      status: 'pendente',
      forma_pagamento: 'boleto',
      numero_parcelas: 1
    };
    
    const response = await fetch('https://uasnyifizdjxogowijip.supabase.co/rest/v1/matricula.registros', {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testMatricula)
    });
    
    const data = await response.json();
    console.log('Matricula creation result:', data);
    return data[0]?.id != null;
  } catch (error) {
    console.error('Matricula creation error:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting core functionality tests...');
  
  const dbConnected = await testDatabaseConnection();
  console.log('Database connection test:', dbConnected ? 'PASSED' : 'FAILED');
  
  if (!dbConnected) {
    console.error('Cannot continue tests without database connection');
    return;
  }
  
  const studentCreated = await testStudentCreation();
  console.log('Student creation test:', studentCreated ? 'PASSED' : 'FAILED');
  
  const courseCreated = await testCourseCreation();
  console.log('Course creation test:', courseCreated ? 'PASSED' : 'FAILED');
  
  const matriculaCreated = await testMatriculaCreation();
  console.log('Matricula creation test:', matriculaCreated ? 'PASSED' : 'FAILED');
  
  console.log('All tests completed.');
}

// Export functions for use in other test scripts
module.exports = {
  testDatabaseConnection,
  testStudentCreation,
  testCourseCreation,
  testMatriculaCreation,
  runTests
};

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}
