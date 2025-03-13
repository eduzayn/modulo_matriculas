'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Home,
  Users,
  BookOpen,
  DollarSign,
  BarChart2,
  Settings,
  HelpCircle,
  Menu,
  X,
  Percent,
} from 'lucide-react';

import { matriculaRoutes } from '@/app/matricula/routes';

interface SidebarProps {
  isMobile?: boolean;
}

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(!isMobile);
  const pathname = usePathname();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  const sidebarItems = [
    {
      name: 'Dashboard',
      href: matriculaRoutes.dashboard,
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Alunos',
      href: matriculaRoutes.alunos,
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'Cursos',
      href: matriculaRoutes.cursos,
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: 'Pagamentos',
      href: matriculaRoutes.pagamentos,
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: 'Descontos',
      href: matriculaRoutes.descontos,
      icon: <Percent className="h-5 w-5" />,
    },
    {
      name: 'Relatórios',
      href: matriculaRoutes.relatorios,
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: 'Configurações',
      href: matriculaRoutes.configuracoes,
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: 'Suporte',
      href: matriculaRoutes.suporte,
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-bold text-xl">Módulo Matrículas</div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      )}

      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isMobile
            ? 'fixed inset-0 z-50 w-64 transition-transform duration-300 ease-in-out bg-white shadow-lg'
            : 'w-64 h-screen bg-white border-r'
        }`}
      >
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b">
            <div className="font-bold text-xl">Módulo Matrículas</div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <X />
            </button>
          </div>
        )}

        <div className={`${isMobile ? 'mt-0' : 'mt-6'} px-4`}>
          {!isMobile && (
            <div className="font-bold text-xl mb-6">Módulo Matrículas</div>
          )}

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'text-white bg-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
