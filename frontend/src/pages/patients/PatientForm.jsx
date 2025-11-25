import React, { useEffect } from 'react'
import {
  Grid,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stepper,
  Step,
  StepLabel
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { useSnackbar } from 'notistack'

import { createPatient, updatePatient } from '../../redux/slices/patientsSlice'

const patientSchema = yup.object({
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: yup.string().email('Invalid email format').optional(),
  phone: yup.string().required('Phone number is required').matches(/^\+?[\d\s-()]{10,}$/, 'Invalid phone number'),
  dateOfBirth: yup.date().required('Date of birth is required').max(new Date(), 'Date of birth cannot be in the future'),
  gender: yup.string().required('Gender is required').oneOf(['Male', 'Female', 'Other'], 'Invalid gender'),
  address: yup.string().optional(),
  bloodGroup: yup.string().oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Invalid blood group').optional(),
  allergies: yup.array().of(yup.string()).optional(),
  medicalHistory: yup.string().optional(),
  emergencyContact: yup.object({
    name: yup.string().required('Emergency contact name is required'),
    relationship: yup.string().required('Relationship is required'),
    phone: yup.string().required('Emergency contact phone is required')
  }).optional()
})

const steps = ['Personal Information', 'Medical Details', 'Emergency Contact']

const PatientForm = ({ patient, onSuccess, onCancel }) => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [activeStep, setActiveStep] = React.useState(0)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(patientSchema),
    defaultValues: patient ? {
      ...patient,
      dateOfBirth: patient.dateOfBirth ? dayjs(patient.dateOfBirth) : null
    } : {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: null,
      gender: '',
      address: '',
      bloodGroup: '',
      allergies: [],
      medicalHistory: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    }
  })

  useEffect(() => {
    if (patient) {
      reset({
        ...patient,
        dateOfBirth: patient.dateOfBirth ? dayjs(patient.dateOfBirth) : null
      })
    }
  }, [patient, reset])

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString() : null
      }

      if (patient) {
        await dispatch(updatePatient({ id: patient.id, data: formattedData })).unwrap()
      } else {
        await dispatch(createPatient(formattedData)).unwrap()
      }
      
      onSuccess()
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to save patient', { variant: 'error' })
    }
  }

  const handleNext = () => {
    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      label="Date of Birth"
                      maxDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.dateOfBirth,
                          helperText: errors.dateOfBirth?.message
                        }
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel>Gender</InputLabel>
                    <Select {...field} label="Gender">
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    {errors.gender && (
                      <Typography variant="caption" color="error">
                        {errors.gender.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        )
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="bloodGroup"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.bloodGroup}>
                    <InputLabel>Blood Group</InputLabel>
                    <Select {...field} label="Blood Group">
                      <MenuItem value="A+">A+</MenuItem>
                      <MenuItem value="A-">A-</MenuItem>
                      <MenuItem value="B+">B+</MenuItem>
                      <MenuItem value="B-">B-</MenuItem>
                      <MenuItem value="AB+">AB+</MenuItem>
                      <MenuItem value="AB-">AB-</MenuItem>
                      <MenuItem value="O+">O+</MenuItem>
                      <MenuItem value="O-">O-</MenuItem>
                    </Select>
                    {errors.bloodGroup && (
                      <Typography variant="caption" color="error">
                        {errors.bloodGroup.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="medicalHistory"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Medical History"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.medicalHistory}
                    helperText={errors.medicalHistory?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        )
      
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContact.name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Emergency Contact Name"
                    fullWidth
                    error={!!errors.emergencyContact?.name}
                    helperText={errors.emergencyContact?.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContact.relationship"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Relationship"
                    fullWidth
                    error={!!errors.emergencyContact?.relationship}
                    helperText={errors.emergencyContact?.relationship?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="emergencyContact.phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Emergency Contact Phone"
                    fullWidth
                    error={!!errors.emergencyContact?.phone}
                    helperText={errors.emergencyContact?.phone?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        )
      
      default:
        return null
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      {renderStepContent(activeStep)}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          onClick={activeStep === 0 ? onCancel : handleBack}
          disabled={isSubmitting}
        >
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        
        <Box>
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained">
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (patient ? 'Update Patient' : 'Create Patient')}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PatientForm