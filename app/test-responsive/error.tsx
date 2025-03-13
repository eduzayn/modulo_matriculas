'use client';

import React, { useEffect } from 'react';
import ServerErrorHandler from '@/app/components/ui/serverErrorHandler';

export default function TestResponsiveError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Test Responsive page error:', error);
  }, [error]);

  return (
    <ServerErrorHandler 
      error={error} 
      reset={reset} 
      module="enrollment" 
    />
  );
}
