import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API route to serve the OpenAPI specification for the Enrollment Module
 */
export async function GET() {
  try {
    // Read the OpenAPI specification from the file
    const specPath = path.join(process.cwd(), 'app', 'api', 'docs', 'spec.json');
    
    if (!fs.existsSync(specPath)) {
      return NextResponse.json(
        { error: 'OpenAPI specification not found' },
        { status: 404 }
      );
    }
    
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
    return NextResponse.json(spec);
  } catch (error) {
    console.error('Error serving OpenAPI specification:', error);
    return NextResponse.json(
      { error: 'Failed to serve OpenAPI specification' },
      { status: 500 }
    );
  }
}
