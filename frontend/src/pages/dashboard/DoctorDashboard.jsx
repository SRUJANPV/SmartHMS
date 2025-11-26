import React, { useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent
} from '@mui/material'
import {
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'

import StatCard from '../../components/dashboard/StatCard'
import RecentActivity from '../../components/dashboard/RecentActivity'

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const { appointments, stats: appointmentStats } = useSelector((state) => state.appointments)

  useEffect(() => {
    // Dispatch actions to fetch doctor's data
  }, [])

  const statCards = [
    {
      title: 'My Patients',
      value: appointmentStats?.uniquePatients || 0,
      icon: <PeopleIcon />,
      color: '#1976d2',
      change: '+8%'
    },
    {
      title: "Today's Appointments",
      value: appointmentStats?.today || 0,
      icon: <CalendarIcon />,
      color: '#2e7d32',
      change: '+3%'
    },
    {
      title: 'Upcoming Appointments',
      value: appointmentStats?.upcoming || 0,
      icon: <ScheduleIcon />,
      color: '#ed6c02',
      change: '+15%'
    },
    {
      title: 'Completed Today',
      value: appointmentStats?.completedToday || 0,
      icon: <CheckCircleIcon />,
      color: '#9c27b0',
      change: '+20%'
    }
  ]

  const todayAppointments = appointments.filter(apt =>
    apt.appointmentDate === new Date().toISOString().split('T')[0] &&
    apt.doctorId === user?.id
  )

  const upcomingAppointments = appointments.filter(apt =>
    new Date(apt.appointmentDate) > new Date() &&
    apt.doctorId === user?.id
  ).slice(0, 5)

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Welcome back, Dr. {user?.firstName} {user?.lastName}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Today's Schedule */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Today's Schedule
            </Typography>
            {todayAppointments.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {todayAppointments.map((appointment, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent sx={{ py: 2 }}>
                      <Typography variant="subtitle1">
                        {appointment.appointmentTime} - {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {appointment.type} - {appointment.status}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No appointments scheduled for today.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Appointments
            </Typography>
            {upcomingAppointments.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {upcomingAppointments.map((appointment, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent sx={{ py: 2 }}>
                      <Typography variant="subtitle1">
                        {appointment.appointmentDate} at {appointment.appointmentTime}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {appointment.patient?.firstName} {appointment.patient?.lastName} - {appointment.type}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No upcoming appointments.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DoctorDashboard