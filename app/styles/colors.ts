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

// CSS Variables for use in Tailwind CSS
export const cssVariables = {
  // Primary colors
  '--color-communication-light': colors.primary.communication.light,
  '--color-communication-main': colors.primary.communication.main,
  '--color-communication-dark': colors.primary.communication.dark,
  '--color-communication-gradient': colors.primary.communication.gradient,
  
  '--color-student-light': colors.primary.student.light,
  '--color-student-main': colors.primary.student.main,
  '--color-student-dark': colors.primary.student.dark,
  '--color-student-gradient': colors.primary.student.gradient,
  
  '--color-content-light': colors.primary.content.light,
  '--color-content-main': colors.primary.content.main,
  '--color-content-dark': colors.primary.content.dark,
  '--color-content-gradient': colors.primary.content.gradient,
  
  '--color-enrollment-light': colors.primary.enrollment.light,
  '--color-enrollment-main': colors.primary.enrollment.main,
  '--color-enrollment-dark': colors.primary.enrollment.dark,
  '--color-enrollment-gradient': colors.primary.enrollment.gradient,
  
  // Neutral colors
  '--color-neutral-50': colors.neutral[50],
  '--color-neutral-100': colors.neutral[100],
  '--color-neutral-200': colors.neutral[200],
  '--color-neutral-300': colors.neutral[300],
  '--color-neutral-400': colors.neutral[400],
  '--color-neutral-500': colors.neutral[500],
  '--color-neutral-600': colors.neutral[600],
  '--color-neutral-700': colors.neutral[700],
  '--color-neutral-800': colors.neutral[800],
  '--color-neutral-900': colors.neutral[900],
  
  // Semantic colors
  '--color-success': colors.semantic.success,
  '--color-warning': colors.semantic.warning,
  '--color-error': colors.semantic.error,
  '--color-info': colors.semantic.info,
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
