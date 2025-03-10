export const theme = {
  colors: {
    primary: '#3B82F6', // blue-500
    primaryDark: '#2563EB', // blue-600
    primaryLight: '#60A5FA', // blue-400
    secondary: '#111827', // gray-900
    secondaryLight: '#374151', // gray-700
    accent: '#8B5CF6', // violet-500
    background: '#FFFFFF',
    backgroundAlt: '#F3F4F6', // gray-100
    text: '#111827', // gray-900
    textLight: '#6B7280', // gray-500
    success: '#10B981', // emerald-500
    warning: '#F59E0B', // amber-500
    error: '#EF4444', // red-500
  },
  gradients: {
    blue: 'linear-gradient(to right, #3B82F6, #2563EB)',
    dark: 'linear-gradient(to right, #111827, #1F2937)',
    accent: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
  },
  spacing: {
    container: 'max-w-7xl',
    paddingMobile: 'p-6',
    paddingDesktop: 'p-8',
    gapMobile: 'gap-6',
    gapDesktop: 'gap-8',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    heading: {
      h1: 'text-4xl md:text-5xl font-bold',
      h2: 'text-3xl md:text-4xl font-bold',
      h3: 'text-2xl md:text-3xl font-bold',
      h4: 'text-xl md:text-2xl font-bold',
    },
    body: {
      default: 'text-base',
      small: 'text-sm',
      large: 'text-lg',
    },
  },
  borderRadius: {
    default: '0.5rem',
    small: '0.25rem',
    large: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};
