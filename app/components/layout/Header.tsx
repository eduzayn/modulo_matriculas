import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
}

export function Header({ title = 'Edunéxia', className, ...props }: HeaderProps) {
  return (
    <header 
      className={cn(
        'bg-white border-b border-gray-200 sticky top-0 z-10',
        className
      )}
      {...props}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-500">
              {title}
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/matricula/pages/dashboard" className="text-gray-700 hover:text-blue-500 transition-colors">
              Dashboard
            </Link>
            <Link href="/matricula/pages/list" className="text-gray-700 hover:text-blue-500 transition-colors">
              Matrículas
            </Link>
            <Link href="/matricula/pages/discounts" className="text-gray-700 hover:text-blue-500 transition-colors">
              Descontos
            </Link>
            <Link href="/matricula/pages/support" className="text-gray-700 hover:text-blue-500 transition-colors">
              Suporte
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link 
              href="/matricula/pages/create" 
              className="bg-gradient-blue text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Nova Matrícula
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
