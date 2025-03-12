// Edunexia Color System
export const colors = {
  // Primary colors for each module
  primary: {
    communication: {
      light: '#4361EE',
      main: '#3B82F6',
      dark: '#2563EB',
      gradient: 'linear-gradient(135deg, #4361EE 0%, #3B82F6 100%)',
    },
    student: {
      light: '#10B981',
      main: '#059669',
      dark: '#047857',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
    content: {
      light: '#8B5CF6',
      main: '#7C3AED',
      dark: '#6D28D9',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    },
    enrollment: {
      light: '#F59E0B',
      main: '#D97706',
      dark: '#B45309',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    },
  },
  // Neutral colors (shared across modules)
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  // Semantic colors (shared across modules)
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
};

// Helper function to get module color
export const getModuleColor = (module: 'communication' | 'student' | 'content' | 'enrollment', variant: 'light' | 'main' | 'dark' | 'gradient' = 'main') => {
  return colors.primary[module][variant];
};

// Helper function to get semantic color
export const getSemanticColor = (type: 'success' | 'warning' | 'error' | 'info') => {
  return colors.semantic[type];
};

// Helper function to get neutral color
export const getNeutralColor = (shade: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900) => {
  return colors.neutral[shade];
};
