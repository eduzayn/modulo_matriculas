const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

// OpenAPI configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enrollment API',
      version: '1.0.0',
      description: 'API for the Enrollment Module of the EduNexia Platform',
    },
    servers: [
      {
        url: '{server}/api',
        variables: {
          server: {
            default: 'https://api.edunexia.com',
            description: 'API server',
          },
        },
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './app/api/**/*.ts',
    './app/matricula/types/**/*.ts',
    './app/matricula/lib/services/api-documentation.ts',
  ],
};

// Generate the OpenAPI specification
const spec = swaggerJsdoc(options);

// Create the output directory if it doesn't exist
const outputDir = path.join(__dirname, '..', 'app', 'api', 'docs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the specification to a file
fs.writeFileSync(
  path.join(outputDir, 'spec.json'),
  JSON.stringify(spec, null, 2)
);

console.log('OpenAPI specification generated successfully!');
