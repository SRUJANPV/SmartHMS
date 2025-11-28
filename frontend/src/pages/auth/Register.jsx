import React, { useState } from 'react'
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Grid,
  InputAdornment,
  Divider,
  Stepper,
  Step,
  StepLabel
} from '@mui/material'
import {
  Person,
  Email,
  Lock,
  Phone,
  Work,
  LocalHospital
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerAction } from '../../redux/slices/authSlice'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Patient',
    password: '',
    confirmPassword: ''
  })
  const [validationErrors, setValidationErrors] = useState({})

  const steps = ['Personal Info', 'Contact Details', 'Security']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step) => {
    const errors = {}
    if (step === 0) {
      if (!formData.firstName || formData.firstName.length < 2) {
        errors.firstName = 'First name must be at least 2 characters'
      }
      if (!formData.lastName || formData.lastName.length < 2) {
        errors.lastName = 'Last name must be at least 2 characters'
      }
      if (!formData.role) {
        errors.role = 'Please select a role'
      }
    } else if (step === 1) {
      if (!formData.email || !formData.email.includes('@')) {
        errors.email = 'Please enter a valid email'
      }
      if (!formData.phone || formData.phone.length < 10) {
        errors.phone = 'Please enter a valid phone number'
      }
    } else if (step === 2) {
      if (!formData.password || formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      }
      if (!formData.confirmPassword || formData.confirmPassword !== formData.password) {
        errors.confirmPassword = 'Passwords must match'
      }
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!validateStep(2)) return

    const finalData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      password: formData.password
    }
    dispatch(registerAction(finalData))
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
          maxWidth: 500,
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <LocalHospital sx={{ fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                SmartCare HMS
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Create Your Account
            </Typography>
          </Box>

          {/* Form Section */}
          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'error.light'
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit}>
              {/* Step 0: Personal Info */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Tell us about yourself
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        placeholder="John"
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!validationErrors.firstName}
                        helperText={validationErrors.firstName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: 'primary.main', mr: 1 }} />
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#f5f7fa',
                            '&.Mui-focused': {
                              backgroundColor: 'white',
                              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        placeholder="Doe"
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!validationErrors.lastName}
                        helperText={validationErrors.lastName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: 'primary.main', mr: 1 }} />
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#f5f7fa',
                            '&.Mui-focused': {
                              backgroundColor: 'white',
                              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        error={!!validationErrors.role}
                        helperText={validationErrors.role}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Work sx={{ color: 'primary.main', mr: 1 }} />
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#f5f7fa',
                            '&.Mui-focused': {
                              backgroundColor: 'white',
                              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                            }
                          }
                        }}
                      >
                        <MenuItem value="Patient">Patient</MenuItem>
                        <MenuItem value="Doctor">Doctor</MenuItem>
                        <MenuItem value="Staff">Staff Member</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Step 1: Contact Details */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Contact Information
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="your@email.com"
                    label="Email Address"
                    type="email"
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
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                        }
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    placeholder="+1 (555) 123-4567"
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!validationErrors.phone}
                    helperText={validationErrors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: 'primary.main', mr: 1 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f5f7fa',
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                        }
                      }
                    }}
                  />
                </Box>
              )}

              {/* Step 2: Security */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Set Your Password
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="••••••••"
                    label="Password"
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
                            onClick={() => setShowPassword(!showPassword)}
                            disableRipple
                            sx={{ minWidth: 'auto', p: 0.5, color: 'text.secondary' }}
                          >
                            {showPassword ? '🙈' : '👁️'}
                          </Button>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f5f7fa',
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
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!validationErrors.confirmPassword}
                    helperText={validationErrors.confirmPassword}
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
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disableRipple
                            sx={{ minWidth: 'auto', p: 0.5, color: 'text.secondary' }}
                          >
                            {showConfirmPassword ? '🙈' : '👁️'}
                          </Button>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f5f7fa',
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                        }
                      }
                    }}
                  />
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{
                    flex: 1,
                    py: 1.2,
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  Back
                </Button>
                {activeStep < 2 ? (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    sx={{
                      flex: 1,
                      py: 1.2,
                      borderRadius: 2,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        boxShadow: '0 12px 28px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      flex: 1,
                      py: 1.2,
                      borderRadius: 2,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                      '&:hover:not(:disabled)': {
                        boxShadow: '0 12px 28px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                  </Button>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
      </Paper>
    </Box>
  )
}

export default Register