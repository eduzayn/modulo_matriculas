import { createOpenAPIConfig } from '@edunexia/core';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

/**
 * OpenAPI configuration for the Enrollment Module
 */
const options = createOpenAPIConfig({
  moduleId: 'enrollment',
  title: 'Enrollment API',
  description: 'API for the Enrollment Module of the EduNexia Platform',
  version: '1.0.0',
  apis: [
    path.join(process.cwd(), 'app', 'api', '**', '*.ts'),
    path.join(process.cwd(), 'app', 'matricula', 'types', '*.ts'),
    path.join(process.cwd(), 'app', 'matricula', 'lib', 'services', 'api-documentation.ts'),
  ],
});

/**
 * Generated OpenAPI specification
 */
export const spec = swaggerJsdoc(options);
