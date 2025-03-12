'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MatriculaRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirecionar para o dashboard usando redirecionamento absoluto
    window.location.href = window.location.origin + '/matricula/pages/dashboard';
  }, [router]);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Redirecionando para o dashboard...</p>
    </div>
  );
}
