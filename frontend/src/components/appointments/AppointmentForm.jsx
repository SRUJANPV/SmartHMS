import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'

const appointmentSchema = yup.object({
  patientId: yup.string().required('Patient is required'),
  doctorId: yup.string().required('Doctor is required'),
  appointmentDate: yup.date().required('Appointment date is required'),
  appointmentTime: yup.string().required('Appointment time is required'),
  type: yup.string().required('Appointment type is required'),
  notes: yup.string()
})

const AppointmentForm = ({ open, onClose, appointment = null }) => {
  const dispatch = useDispatch()
  const { patients = [] } = useSelector((state) => state.patients) || {}
  
  // Mock doctors list since doctors slice doesn't exist yet
  const doctors = [
    { id: 1, firstName: 'John', lastName: 'Smith' },
    { id: 2, firstName: 'Sarah', lastName: 'Johnson' },
    { id: 3, firstName: 'Michael', lastName: 'Brown' }
  ]

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    defaultValues: appointment || {
      patientId: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      type: '',
      notes: ''
    }
  })

  useEffect(() => {
    if (appointment) {
      reset(appointment)
    } else {
      reset({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        type: '',
        notes: ''
      })
    }
  }, [appointment, reset])

  const onSubmit = (data) => {
    if (appointment) {
      // dispatch(updateAppointment({ id: appointment.id, ...data }))
    } else {
      // dispatch(createAppointment(data))
    }
    onClose()
  }

  const appointmentTypes = [
    'General Checkup',
    'Consultation',
    'Follow-up',
    'Emergency',
    'Surgery',
    'Therapy'
  ]

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {appointment ? 'Edit Appointment' : 'Schedule New Appointment'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="patientId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Patient"
                    error={!!errors.patientId}
                    helperText={errors.patientId?.message}
                  >
                    {patients?.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} (ID: {patient.patientId})
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="doctorId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Doctor"
                    error={!!errors.doctorId}
                    helperText={errors.doctorId?.message}
                  >
                    {doctors?.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.firstName} {doctor.lastName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="appointmentDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Appointment Date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.appointmentDate}
                    helperText={errors.appointmentDate?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="appointmentTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Appointment Time"
                    error={!!errors.appointmentTime}
                    helperText={errors.appointmentTime?.message}
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Appointment Type"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  >
                    {appointmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Notes"
                    placeholder="Additional notes or special instructions"
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {appointment ? 'Update' : 'Schedule'} Appointment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AppointmentForm