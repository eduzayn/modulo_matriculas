'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

interface SwaggerUIProps {
  specUrl?: string;
  spec?: object;
}

/**
 * API Documentation component that renders Swagger UI
 */
export default function ApiDocumentation({ specUrl, spec }: SwaggerUIProps) {
  return (
    <div className="api-documentation">
      <SwaggerUI spec={spec} url={specUrl} />
    </div>
  );
}
