'use client';

import React, { useState, useEffect } from 'react';
import { colors } from '../../styles/colors';
import { BarChart2, Users, BookOpen, CreditCard, TrendingUp, Calendar, Filter, Download } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, description, icon, color }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
    <div className="p-1" style={{ background: color }}></div>
    <div className="p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base md:text-lg font-medium text-neutral-800">{title}</h3>
          <p className="text-xl md:text-3xl font-bold mt-2">{value}</p>
          {description && <p className="text-xs md:text-sm text-neutral-500 mt-1">{description}</p>}
        </div>
        <div className="p-2 md:p-3 rounded-full bg-neutral-100">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  color: string;
}

const ChartCard = ({ title, children, color }: ChartCardProps) => (
  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
    <div className="p-1" style={{ background: color }}></div>
    <div className="p-4 md:p-6">
      <h3 className="text-base md:text-lg font-medium text-neutral-800 mb-4">{title}</h3>
      {children}
    </div>
  </div>
);

interface DashboardProps {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  data?: any;
}

export const Dashboard = ({ 
  module = 'enrollment',
  data = {
    stats: [
      { title: 'Total de Matrículas', value: 1248, description: '+12% em relação ao mês anterior' },
      { title: 'Novos Alunos', value: 86, description: 'Nos últimos 30 dias' },
      { title: 'Cursos Ativos', value: 24, description: '3 lançamentos este mês' },
      { title: 'Receita Mensal', value: 'R$ 124.500', description: '+8% em relação ao mês anterior' },
    ]
  }
}: DashboardProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const moduleColor = colors.primary[module];
  const moduleTitle = 
    module === 'communication' ? 'Comunicação' : 
    module === 'student' ? 'Portal do Aluno' :
    module === 'content' ? 'Conteúdo' : 'Matrículas';
  
  // Icons based on module
  const getIcon = (index: number) => {
    const iconSize = isMobile ? 20 : 24;
    
    if (module === 'enrollment') {
      const icons = [
        <Users key="users" size={iconSize} color={moduleColor.main} />,
        <Users key="newusers" size={iconSize} color={moduleColor.main} />,
        <BookOpen key="courses" size={iconSize} color={moduleColor.main} />,
        <CreditCard key="revenue" size={iconSize} color={moduleColor.main} />
      ];
      return icons[index % icons.length];
    } else if (module === 'communication') {
      const icons = [
        <BarChart2 key="stats" size={iconSize} color={moduleColor.main} />,
        <Users key="users" size={iconSize} color={moduleColor.main} />,
        <Calendar key="calendar" size={iconSize} color={moduleColor.main} />,
        <TrendingUp key="trending" size={iconSize} color={moduleColor.main} />
      ];
      return icons[index % icons.length];
    } else if (module === 'student') {
      const icons = [
        <BookOpen key="courses" size={iconSize} color={moduleColor.main} />,
        <Calendar key="calendar" size={iconSize} color={moduleColor.main} />,
        <BarChart2 key="stats" size={iconSize} color={moduleColor.main} />,
        <CreditCard key="payments" size={iconSize} color={moduleColor.main} />
      ];
      return icons[index % icons.length];
    } else {
      const icons = [
        <BookOpen key="content" size={iconSize} color={moduleColor.main} />,
        <Users key="users" size={iconSize} color={moduleColor.main} />,
        <BarChart2 key="stats" size={iconSize} color={moduleColor.main} />,
        <Calendar key="calendar" size={iconSize} color={moduleColor.main} />
      ];
      return icons[index % icons.length];
    }
  };
  
  return (
    <div className="container py-4 md:py-6 lg:py-8 space-y-4 md:space-y-6 lg:space-y-8">
      {/* Header - Responsive layout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
            Dashboard de {moduleTitle}
          </h1>
          <p className="text-neutral-500 mt-1">
            Visão geral e estatísticas do sistema
          </p>
        </div>
        <div className="flex gap-2">
          {isMobile && (
            <button 
              className="p-2 rounded-md border border-neutral-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
            </button>
          )}
          <button 
            className="px-3 py-2 md:px-4 md:py-2 rounded-md text-white font-medium flex items-center gap-2"
            style={{ background: moduleColor.gradient }}
          >
            <Download size={isMobile ? 16 : 20} />
            {!isMobile && <span>Exportar Relatório</span>}
          </button>
        </div>
      </div>
      
      {/* Mobile Filters */}
      {isMobile && showFilters && (
        <div className="bg-white p-4 rounded-lg border border-neutral-200 mb-4">
          <h3 className="font-medium mb-2">Filtros</h3>
          <div className="space-y-2">
            <select className="w-full p-2 border border-neutral-200 rounded-md">
              <option>Últimos 30 dias</option>
              <option>Últimos 90 dias</option>
              <option>Este ano</option>
            </select>
            <select className="w-full p-2 border border-neutral-200 rounded-md">
              <option>Todos os cursos</option>
              <option>Curso 1</option>
              <option>Curso 2</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Stats grid - Responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {data.stats.map((stat: any, index: number) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={getIcon(index)}
            color={moduleColor.gradient}
          />
        ))}
      </div>
      
      {/* Charts - Responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ChartCard title="Matrículas por Período" color={moduleColor.gradient}>
          <div className="h-48 md:h-64 flex items-center justify-center bg-neutral-50 rounded-md">
            <p className="text-neutral-400">Gráfico de Matrículas</p>
          </div>
        </ChartCard>
        
        <ChartCard title="Distribuição por Curso" color={moduleColor.gradient}>
          <div className="h-48 md:h-64 flex items-center justify-center bg-neutral-50 rounded-md">
            <p className="text-neutral-400">Gráfico de Distribuição</p>
          </div>
        </ChartCard>
      </div>
      
      {/* Recent activity - Responsive layout */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-1" style={{ background: moduleColor.gradient }}></div>
        <div className="p-4 md:p-6">
          <h3 className="text-base md:text-lg font-medium text-neutral-800 mb-4">Atividades Recentes</h3>
          
          <div className="space-y-3 md:space-y-4">
            {/* Show fewer items on mobile */}
            {[1, 2, 3, 4, 5].slice(0, isMobile ? 3 : 5).map((item) => (
              <div key={item} className="flex items-center p-2 md:p-3 border-b border-neutral-100 last:border-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-100 flex items-center justify-center mr-3 md:mr-4">
                  <Users size={isMobile ? 16 : 20} color={moduleColor.main} />
                </div>
                <div>
                  <p className="font-medium text-sm md:text-base">Nova matrícula realizada</p>
                  <p className="text-xs md:text-sm text-neutral-500">Há 2 horas atrás</p>
                </div>
              </div>
            ))}
            
            {/* Show "Ver mais" on mobile */}
            {isMobile && (
              <button 
                className="w-full text-center py-2 text-sm font-medium"
                style={{ color: moduleColor.main }}
              >
                Ver mais atividades
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around items-center h-16 z-50">
          <div className="flex flex-col items-center justify-center text-xs" style={{ color: moduleColor.main }}>
            <Home size={20} />
            <span>Início</span>
          </div>
          <div className="flex flex-col items-center justify-center text-xs text-neutral-600">
            <Users size={20} />
            <span>Alunos</span>
          </div>
          <div className="flex flex-col items-center justify-center text-xs text-neutral-600">
            <BookOpen size={20} />
            <span>Cursos</span>
          </div>
          <div className="flex flex-col items-center justify-center text-xs text-neutral-600">
            <CreditCard size={20} />
            <span>Pagamentos</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Add Home icon for mobile navigation
const Home = ({ size, ...props }: { size: number, [key: string]: any }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

export default Dashboard;
