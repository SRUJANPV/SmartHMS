import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import store from './redux/store'
import { useAuth } from './hooks/useAuth'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

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

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036'
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff'
    },
    success: {
      main: '#2e7d32'
    },
    warning: {
      main: '#ed6c02'
    },
    error: {
      main: '#d32f2f'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    h6: {
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
        }
      }
    }
  }
})

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role?.name !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
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

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role?.name))) {
    return <Navigate to="/unauthorized" replace />; // Or a dedicated unauthorized page
  }

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              } />
              <Route path="/register" element={
                <AuthLayout>
                  <Register />
                </AuthLayout>
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
    </Provider>
  )
}

export default App