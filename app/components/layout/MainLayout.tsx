'use client';

import React from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  navItems?: Array<{
    path: string;
    name: string;
    icon: any;
  }>;
}

export const MainLayout = ({ 
  children, 
  module = 'enrollment',
  navItems
}: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar module={module} navItems={navItems} />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-16 lg:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
