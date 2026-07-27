import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#16A34A',
        light: '#22C55E',
        dark: '#15803D',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#38BDF8' : '#111827',
        light: isDark ? '#0EA5E9' : '#374151',
        dark: isDark ? '#0284C7' : '#030712',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#F59E0B',
        light: '#FCD34D',
        dark: '#D97706',
        contrastText: '#ffffff',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
      },
      info: {
        main: '#3B82F6',
        light: '#60A5FA',
      },
      success: {
        main: '#16A34A',
        light: '#22C55E',
      },
      background: {
        default: isDark ? '#0F172A' : '#F9FAFB',
        paper: isDark ? '#1E293B' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F8FAFC' : '#111827',
        secondary: isDark ? '#94A3B8' : '#6B7280',
        disabled: isDark ? '#64748B' : '#9CA3AF',
      },
      divider: isDark ? '#334155' : '#E5E7EB',
      grey: {
        50: isDark ? '#1E293B' : '#F9FAFB',
        100: isDark ? '#334155' : '#F3F4F6',
        200: isDark ? '#475569' : '#E5E7EB',
        300: isDark ? '#64748B' : '#D1D5DB',
        400: isDark ? '#94A3B8' : '#9CA3AF',
        500: isDark ? '#CBD5E1' : '#6B7280',
        600: isDark ? '#E2E8F0' : '#4B5563',
        700: isDark ? '#F1F5F9' : '#374151',
        800: isDark ? '#F8FAFC' : '#1F2937',
        900: isDark ? '#FFFFFF' : '#111827',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif',
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.15 },
      h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2 },
      h3: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.25 },
      h4: { fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.015em' },
      h6: { fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.01em' },
      subtitle1: { fontSize: '0.9375rem', fontWeight: 600, letterSpacing: '-0.005em' },
      subtitle2: { fontSize: '0.875rem', fontWeight: 600, color: isDark ? '#94A3B8' : '#6B7280' },
      body1: { fontSize: '0.9375rem', lineHeight: 1.65 },
      body2: { fontSize: '0.875rem', lineHeight: 1.55 },
      caption: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.4 },
      overline: { fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      isDark ? '0 1px 3px 0 rgba(0,0,0,0.3)' : '0 1px 2px 0 rgba(0,0,0,0.04)',
      isDark ? '0 2px 5px 0 rgba(0,0,0,0.4)' : '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
      isDark ? '0 4px 10px 0 rgba(0,0,0,0.5)' : '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.05)',
      ...Array(21).fill('none'),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@import': "url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap')",
          body: {
            backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
            color: isDark ? '#F8FAFC' : '#111827',
          },
          '*::-webkit-scrollbar': { width: 6, height: 6 },
          '*::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: isDark ? '#475569' : '#D1D5DB',
            borderRadius: 10,
            '&:hover': { backgroundColor: isDark ? '#64748B' : '#9CA3AF' },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 10,
            letterSpacing: '-0.01em',
            transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          contained: {
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
              transform: 'translateY(-1px)',
            },
            '&:active': { transform: 'translateY(0)', boxShadow: 'none' },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
            borderRadius: 16,
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
              color: isDark ? '#F8FAFC' : '#111827',
              fontSize: '0.9rem',
              transition: 'all 0.15s ease',
              '&:hover': {
                backgroundColor: isDark ? '#1E293B' : '#F3F4F6',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? '#64748B' : '#9CA3AF' },
              },
              '&.Mui-focused': {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#16A34A',
                  borderWidth: 2,
                  boxShadow: '0 0 0 3px rgba(22,163,74,0.15)',
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#334155' : '#E5E7EB',
              },
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isDark ? '#94A3B8' : '#6B7280',
              '&.Mui-focused': { color: '#16A34A' },
            },
            '& .MuiFormHelperText-root': {
              fontSize: '0.72rem',
              marginTop: 4,
              color: isDark ? '#64748B' : '#9CA3AF',
            },
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 600,
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: isDark ? '#94A3B8' : '#9CA3AF',
              backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
              borderBottom: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
              padding: '10px 16px',
            },
          },
        },
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-body': {
              fontSize: '0.875rem',
              color: isDark ? '#E2E8F0' : '#111827',
              padding: '10px 16px',
              borderBottom: `1px solid ${isDark ? '#1E293B' : '#F3F4F6'}`,
            },
            '& .MuiTableRow-root': {
              transition: 'background-color 0.1s ease',
              '&:hover': { backgroundColor: isDark ? '#334155' : '#F9FAFB' },
              '&:last-child td': { borderBottom: 'none' },
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            letterSpacing: '-0.01em',
            minHeight: 44,
            transition: 'all 0.15s ease',
            color: isDark ? '#94A3B8' : '#6B7280',
            '&.Mui-selected': { color: isDark ? '#F8FAFC' : '#111827' },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isDark ? '#334155' : '#F3F4F6' },
        },
      },
    },
  });
};

const theme = getTheme('light');
export default theme;
