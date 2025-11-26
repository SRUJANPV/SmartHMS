import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Grid
} from '@mui/material'
import { PersonAdd as RegisterIcon } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { register as registerAction, clearError } from '../../redux/slices/authSlice'

const registerSchema = yup.object({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  phone: yup
    .string()
    .matches(/^\+?[\d\s-()]{10,}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  role: yup
    .string()
    .oneOf(['Patient', 'Doctor', 'Staff'], 'Please select a valid role')
    .required('Role is required')
})

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'Patient',
      password: '',
      confirmPassword: ''
    }
  })

  const roleValue = watch('role')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const onSubmit = (data) => {
    try {
      console.log('Form data being submitted:', data)
      const { confirmPassword } = data
      const finalData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password
      }
      console.log('Submitting registration data:', finalData)
      dispatch(registerAction(finalData))
    } catch (error) {
      console.error('Error in onSubmit:', error)
    }
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <RegisterIcon sx={{ m: 1, bgcolor: 'primary.main', borderRadius: 1, p: 1, color: 'white' }} />
          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  {...register('role')}
                  value={roleValue || 'Patient'}
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  disabled={isLoading}
                >
                  <MenuItem value="Patient">Patient</MenuItem>
                  <MenuItem value="Doctor">Doctor</MenuItem>
                  <MenuItem value="Staff">Staff</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <RegisterIcon />}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Register