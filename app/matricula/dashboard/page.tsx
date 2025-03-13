'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Use window.location for more reliable redirection in static export
    window.location.href = window.location.origin + '/matricula/pages/dashboard';
  }, []);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Redirecionando para o dashboard...</p>
    </div>
  );
}
