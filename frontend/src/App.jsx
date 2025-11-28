import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import store from './redux/store'
import { useAuth } from './hooks/useAuth'
import { getCurrentUser } from './redux/slices/authSlice'
import { getPatients } from './redux/slices/patientsSlice'
import { getAppointments, getAppointmentStats } from './redux/slices/appointmentsSlice'
import { getBills, getBillingStats } from './redux/slices/billingSlice'
import { getInventory, getInventoryStats } from './redux/slices/inventorySlice'
import { getStaffList } from './redux/slices/staffSlice'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Setup Page
import SetupPage from './pages/setup/SetupPage'

// Dashboard Pages
import AdminDashboard from './pages/dashboard/AdminDashboard'
import DoctorDashboard from './pages/dashboard/DoctorDashboard'
import StaffDashboard from './pages/dashboard/StaffDashboard'
import PatientDashboard from './pages/dashboard/PatientDashboard'

// Module Pages
import Patients from './pages/patients/Patients'
import PatientDetails from './pages/patients/PatientDetails'
import Appointments from './pages/appointments/Appointments'
import Billing from './pages/billing/Billing'
import Inventory from './pages/inventory/Inventory'
import Analytics from './pages/analytics/Analytics'

// Professional Theme Configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#4791db',
      dark: '#115293',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#dc004e',
      light: '#e33371',
      dark: '#9a0036',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff'
    },
    success: {
      main: '#4caf50',
      light: '#6fbf73',
      dark: '#357a38'
    },
    warning: {
      main: '#ff9800',
      light: '#ffac33',
      dark: '#b26a00'
    },
    error: {
      main: '#f44336',
      light: '#f6685e',
      dark: '#aa2e25'
    },
    info: {
      main: '#2196f3',
      light: '#4dabf5',
      dark: '#1769aa'
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    }
  },
  typography: {
    fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.6
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },
  shape: {
    borderRadius: 12
  },
  spacing: 8,
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 6px 12px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.12)',
    '0px 12px 24px rgba(0,0,0,0.14)',
    '0px 16px 32px rgba(0,0,0,0.16)',
    '0px 20px 40px rgba(0,0,0,0.18)',
    '0px 24px 48px rgba(0,0,0,0.2)',
    '0px 2px 8px rgba(0,0,0,0.08)',
    '0px 4px 16px rgba(0,0,0,0.1)',
    '0px 6px 24px rgba(0,0,0,0.12)',
    '0px 8px 32px rgba(0,0,0,0.14)',
    '0px 12px 40px rgba(0,0,0,0.16)',
    '0px 16px 48px rgba(0,0,0,0.18)',
    '0px 20px 56px rgba(0,0,0,0.2)',
    '0px 24px 64px rgba(0,0,0,0.22)',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 6px 12px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.12)',
    '0px 12px 24px rgba(0,0,0,0.14)',
    '0px 16px 32px rgba(0,0,0,0.16)',
    '0px 20px 40px rgba(0,0,0,0.18)',
    '0px 24px 48px rgba(0,0,0,0.2)'
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#bdbdbd #f5f5f5',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 4,
            backgroundColor: '#bdbdbd',
            minHeight: 24
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#999'
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: '#f5f5f5'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
        },
        elevation2: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)'
        },
        elevation3: {
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
          fontSize: '0.95rem',
          borderRadius: 8,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)'
          }
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem'
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.875rem'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
          backgroundColor: '#ffffff',
          color: '#212121'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#1976d2'
            }
          }
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: 12,
          '& .MuiDataGrid-cell': {
            borderColor: '#f0f0f0'
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f7fa',
            borderRadius: '12px 12px 0 0',
            borderBottom: '2px solid #e0e0e0'
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: '#f5f9ff'
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f5f7fa'
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true
      }
    },
    MuiMenuItem: {
      defaultProps: {
        disableRipple: true
      }
    }
  }
})

// Backend Health Check Component (removed to prevent excessive calls)

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!allowedRoles.includes(user?.role?.name)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return children
}

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Role-based Route Component
const ConditionalDashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role?.name) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Doctor':
      return <DoctorDashboard />;
    case 'Nurse':
    case 'Staff':
      return <StaffDashboard />;
    case 'Patient':
      return <PatientDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// App initialization wrapper
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const [isInitialized, setIsInitialized] = React.useState(false)

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          await dispatch(getCurrentUser()).unwrap()
          // Load all application data after auth is successful
          dispatch(getPatients())
          dispatch(getAppointments())
          dispatch(getAppointmentStats())
          dispatch(getBills())
          dispatch(getBillingStats())
          dispatch(getInventory())
          dispatch(getInventoryStats())
          dispatch(getStaffList())
        } catch (error) {
          // Token is invalid, will be handled by auth slice
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
        }
      }
      setIsInitialized(true)
    }
    
    initAuth()
  }, [dispatch, token])

  if (!isInitialized) {
    return null // Or a loading spinner
  }

  return children
}

function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider 
            maxSnack={3}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <Routes>
              {/* Setup Route */}
              <Route path="/setup" element={<SetupPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <AuthLayout>
                    <Login />
                  </AuthLayout>
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <AuthLayout>
                    <Register />
                  </AuthLayout>
                </PublicRoute>
              } />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ConditionalDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ConditionalDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />

              {/* Admin & Staff Routes */}
              {/* Admin & Staff Routes */}
              <Route path="/patients" element={
                <ProtectedRoute requiredRole={['Admin', 'Doctor', 'Staff']}>
                  <MainLayout>
                    <Patients />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/patients/:id" element={
                <ProtectedRoute requiredRole={['Admin', 'Doctor', 'Staff']}>
                  <MainLayout>
                    <PatientDetails />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/appointments" element={
                <ProtectedRoute requiredRole={['Admin', 'Doctor', 'Staff', 'Patient']}>
                  <MainLayout>
                    <Appointments />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/billing" element={
                <ProtectedRoute requiredRole={['Admin', 'Staff']}>
                  <MainLayout>
                    <Billing />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/inventory" element={
                <ProtectedRoute requiredRole={['Admin', 'Staff']}>
                  <MainLayout>
                    <Inventory />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="/analytics" element={
                <ProtectedRoute requiredRole={['Admin', 'Doctor']}>
                  <MainLayout>
                    <Analytics />
                  </MainLayout>
                </ProtectedRoute>
              } />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
      </AppInitializer>
    </Provider>
  )
}

export default App