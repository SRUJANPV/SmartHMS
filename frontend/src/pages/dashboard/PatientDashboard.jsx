import React, { useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip
} from '@mui/material'
import {
  CalendarToday as CalendarIcon,
  Receipt as BillingIcon,
  MedicalServices as MedicalIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'

import StatCard from '../../components/dashboard/StatCard'

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const { appointments } = useSelector((state) => state.appointments)
  const { bills } = useSelector((state) => state.billing)

  useEffect(() => {
    // Dispatch actions to fetch patient data
  }, [])

  const patientAppointments = appointments.filter(apt => apt.patientId === user?.id)
  const upcomingAppointments = patientAppointments.filter(apt =>
    new Date(apt.appointmentDate) > new Date()
  ).slice(0, 3)

  const recentBills = bills.filter(bill => bill.patientId === user?.id).slice(0, 3)

  const statCards = [
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments.length,
      icon: <CalendarIcon />,
      color: '#1976d2',
      change: null
    },
    {
      title: 'Total Appointments',
      value: patientAppointments.length,
      icon: <ScheduleIcon />,
      color: '#2e7d32',
      change: null
    },
    {
      title: 'Pending Bills',
      value: recentBills.filter(bill => bill.status === 'pending').length,
      icon: <BillingIcon />,
      color: '#ed6c02',
      change: null
    },
    {
      title: 'Medical Records',
      value: 5, // This would come from medical records state
      icon: <MedicalIcon />,
      color: '#9c27b0',
      change: null
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary'
      case 'completed': return 'success'
      case 'cancelled': return 'error'
      default: return 'default'
    }
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Welcome back, {user?.firstName} {user?.lastName}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Appointments and Bills */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Upcoming Appointments
              </Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            {upcomingAppointments.length > 0 ? (
              <Box>
                {upcomingAppointments.map((appointment, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1">
                            {appointment.appointmentDate} at {appointment.appointmentTime}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {appointment.type}
                          </Typography>
                        </Box>
                        <Chip
                          label={appointment.status}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No upcoming appointments.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Bills
              </Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            {recentBills.length > 0 ? (
              <Box>
                {recentBills.map((bill, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1">
                            Bill #{bill.billNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {bill.createdAt}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${bill.total}
                          </Typography>
                        </Box>
                        <Chip
                          label={bill.status}
                          color={bill.status === 'paid' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent bills.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" color="primary">
                Book Appointment
              </Button>
              <Button variant="outlined" color="primary">
                View Medical Records
              </Button>
              <Button variant="outlined" color="primary">
                Download Reports
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PatientDashboard