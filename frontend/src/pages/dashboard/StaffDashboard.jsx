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
  Receipt as BillingIcon,
  Assignment as TaskIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'

import StatCard from '../../components/dashboard/StatCard'
import RecentActivity from '../../components/dashboard/RecentActivity'

const StaffDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const { stats: patientStats = {} } = useSelector((state) => state.patients || {})
  const { stats: appointmentStats = {} } = useSelector((state) => state.appointments || {})
  const { stats: billingStats = {} } = useSelector((state) => state.billing || {})

  useEffect(() => {
    // Dispatch actions to fetch staff data
  }, [])

  const statCards = [
    {
      title: 'Total Patients',
      value: patientStats?.total || 0,
      icon: <PeopleIcon />,
      color: '#1976d2',
      change: '+10%'
    },
    {
      title: 'Appointments Today',
      value: appointmentStats?.today || 0,
      icon: <CalendarIcon />,
      color: '#2e7d32',
      change: '+7%'
    },
    {
      title: 'Pending Bills',
      value: billingStats?.pending || 0,
      icon: <BillingIcon />,
      color: '#ed6c02',
      change: '-5%'
    },
    {
      title: 'Tasks Completed',
      value: 24,
      icon: <TaskIcon />,
      color: '#9c27b0',
      change: '+15%'
    }
  ]

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

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Card sx={{ mb: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="subtitle1">
                    Register New Patient
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add a new patient to the system
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ mb: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="subtitle1">
                    Schedule Appointment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Book an appointment for a patient
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ mb: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="subtitle1">
                    Generate Bill
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create a bill for patient services
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <RecentActivity />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StaffDashboard