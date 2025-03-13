'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Percent, 
  CreditCard, 
  FileText, 
  Settings,
  Menu,
  X
} from 'lucide-react';

// Import colors directly from our themeProvider
const colors = {
  primary: 'blue-600',
  secondary: 'purple-600',
  success: 'green-600',
  danger: 'red-600',
  warning: 'yellow-600',
  info: 'cyan-600',
};

interface SidebarProps {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  navItems?: Array<{
    path: string;
    name: string;
    icon: any;
  }>;
}

export function Sidebar({ 
  module = 'enrollment',
  navItems
}: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const defaultNavItems = [
    {
      path: '/matricula/dashboard',
      name: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: '/matricula/alunos',
      name: 'Alunos',
      icon: <Users className="h-5 w-5" />,
    },
    {
      path: '/matricula/cursos',
      name: 'Cursos',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      path: '/matricula/descontos',
      name: 'Descontos',
      icon: <Percent className="h-5 w-5" />,
    },
    {
      path: '/matricula/pagamentos',
      name: 'Pagamentos',
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      path: '/matricula/relatorios',
      name: 'Relatórios',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      path: '/matricula/configuracoes',
      name: 'Configurações',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const items = navItems || defaultNavItems;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } w-64 md:w-16 lg:w-64 bg-white border-r border-gray-200 md:block`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center justify-center h-14 mb-5">
            <span className="text-xl font-semibold md:hidden lg:block">Edunexia</span>
            <span className="text-xl font-semibold hidden md:block lg:hidden">E</span>
          </div>
          <ul className="space-y-2">
            {items.map((item) => {
              const isActive = pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center p-2 rounded-md group ${
                      isActive
                        ? `text-white bg-${colors.primary}`
                        : `text-gray-700 hover:bg-gray-100`
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3 md:hidden lg:block">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
