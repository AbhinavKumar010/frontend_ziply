import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      lighter: '#FFE8E8',
      dark: '#FF4848',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#4ECDC4',
      light: '#71D7D0',
      lighter: '#E8F7F6',
      dark: '#3BAFA8',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#2ECC71',
      light: '#58D68D',
      lighter: '#E8F6EC',
      dark: '#27AE60'
    },
    warning: {
      main: '#F1C40F',
      light: '#F4D03F',
      lighter: '#FCF3CF',
      dark: '#F39C12'
    },
    error: {
      main: '#E74C3C',
      light: '#EC7063',
      lighter: '#FADBD8',
      dark: '#C0392B'
    },
    grey: {
      100: '#F7FAFC',
      200: '#EDF2F7',
      300: '#E2E8F0',
      400: '#CBD5E0',
      500: '#A0AEC0',
      600: '#718096',
      700: '#4A5568',
      800: '#2D3748',
      900: '#1A202C'
    },
    background: {
      default: '#F7FAFC',
      paper: '#FFFFFF'
    }
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.2
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    }
  },
  shape: {
    borderRadius: 8
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
    '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
    '0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
    '0 20px 40px rgba(0,0,0,0.2)',
    ...Array(19).fill('none')
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500
        }
      }
    }
  }
});

export default theme; 