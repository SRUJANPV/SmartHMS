import React, { useState } from 'react'
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link as MuiLink,
  InputAdornment,
  Divider,
  Card,
  CardContent
} from '@mui/material'
import { Visibility, VisibilityOff, Email, Lock, LocalHospital } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../redux/slices/authSlice'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)
  
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [validationErrors, setValidationErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!formData.email || !formData.email.includes('@')) {
      errors.email = 'Please enter a valid email'
    }
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    setValidationErrors({})
    try {
      await dispatch(login(formData)).unwrap()
      navigate('/dashboard', { replace: true })
    } catch (error) {
      // Error is already handled by Redux slice
    }
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: 450,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
          {/* Header Section with Gradient */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              color: 'white',
              p: { xs: 3, sm: 4 },
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent)',
                pointerEvents: 'none'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <LocalHospital sx={{ fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                SmartCare HMS
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Healthcare Management System
            </Typography>
          </Box>

          {/* Form Section */}
          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5,
                textAlign: 'center'
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 3 }}
            >
              Sign in to access your account
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'error.light',
                  backgroundColor: 'error.lighter',
                  animation: 'slideDown 0.3s ease-in-out'
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit}>
              <TextField
                fullWidth
                placeholder="your@email.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'primary.main', mr: 1 }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f5f7fa',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#f0f2f5'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'primary.main', mr: 1 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={handleClickShowPassword}
                        disableRipple
                        sx={{
                          minWidth: 'auto',
                          p: 0.5,
                          color: 'text.secondary',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: 'primary.main'
                          }
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    </InputAdornment>
                  )
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f5f7fa',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#f0f2f5'
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                    }
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mb: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover:not(:disabled)': {
                    boxShadow: '0 12px 28px rgba(25, 118, 210, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    opacity: 0.7
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>

              <Divider sx={{ my: 2 }}>OR</Divider>

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    borderBottom: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderBottomColor = '#1976d2'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderBottomColor = 'transparent'
                  }}
                >
                  Sign up now
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* Demo Credentials Card */}
          {/* <Card
            sx={{
              m: { xs: 2, sm: 3 },
              mb: { xs: 3, sm: 4 },
              backgroundColor: 'primary.lighter',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.light',
              boxShadow: 'none'
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                📋 Demo Login Credentials
              </Typography>
              <Box sx={{ backgroundColor: 'white', p: 1.5, borderRadius: 1, mb: 1 }}>
                <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  Email: admin@smartcare.com
                </Typography>
                <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  Password: admin123
                </Typography>
              </Box>
            </CardContent>
          </Card> */}
      </Paper>
    </Box>
  )
}

export default Login