// src/styles/theme.ts
export const colors = {
    // Couleurs principales Oranbank
    primary: '#FF6600',      // Orange principal
    primaryLight: '#FF8533', // Orange clair
    primaryDark: '#E55A00',  // Orange foncé
    
    // Couleurs de base
    white: '#FFFFFF',
    black: '#000000',
    
    // Couleurs grises
    gray: {
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
    
    // Couleurs d'état
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    // Couleurs spécifiques
    background: '#FFFFFF',
    text: {
      primary: '#000000',
      secondary: '#4B5563',
      light: '#9CA3AF',
    },
    border: '#E5E7EB',
  };
  
  export const theme = {
    colors,
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
  };