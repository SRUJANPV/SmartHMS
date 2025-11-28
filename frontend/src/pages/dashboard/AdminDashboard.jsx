import React, { useEffect, useState } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Skeleton,
  CircularProgress
} from '@mui/material'
import {
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Receipt as BillingIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'

import StatCard from '../../components/dashboard/StatCard'
import RecentActivity from '../../components/dashboard/RecentActivity'
import { getDashboardStats, getRecentAppointments } from '../../services/api'

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    patients: {},
    appointments: {},
    billing: {},
    inventory: {}
  })
  const [recentAppointments, setRecentAppointments] = useState([])

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const dashboardStats = await getDashboardStats()
        setStats(dashboardStats)

        const appointments = await getRecentAppointments(5)
        setRecentAppointments(appointments)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.patients?.totalPatients || 0,
      icon: <PeopleIcon />,
      color: '#1976d2',
      change: `${stats.patients?.change || 0}%`,
      loading
    },
    {
      title: "Today's Appointments",
      value: stats.appointments?.todayAppointments || 0,
      icon: <CalendarIcon />,
      color: '#2e7d32',
      change: '+5%',
      loading
    },
    {
      title: 'Monthly Revenue',
      value: `₹${(stats.billing?.monthlyRevenue || 0).toLocaleString('en-IN')}`,
      icon: <BillingIcon />,
      color: '#ed6c02',
      change: '+18%',
      loading
    },
    {
      title: 'Low Stock Items',
      value: stats.inventory?.lowStockItems || 0,
      icon: <InventoryIcon />,
      color: '#d32f2f',
      change: '-3%',
      loading
    }
  ]

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary',
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
          Overview of your hospital management system
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }} sx={{ mb: 5 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            {loading ? (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  height: '100%'
                }}
              >
                <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={32} />
              </Paper>
            ) : (
              <StatCard {...stat} />
            )}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 3, lg: 4 }}>
        {/* Recent Appointments */}
        <Grid item xs={12} lg={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3, lg: 4 }, 
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                mb: 3 
              }}
            >
              Recent Appointments
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : recentAppointments.length > 0 ? (
              <RecentActivity items={recentAppointments.map((apt) => ({
                id: apt.id,
                title: `${apt.patientId ? `Patient ${apt.patientId}` : 'Unknown'} - ${apt.type || 'Appointment'}`,
                time: new Date(apt.appointmentDate).toLocaleDateString(),
                status: apt.status
              }))} />
            ) : (
              <Typography variant="body2" color="text.secondary">No recent appointments</Typography>
            )}
          </Paper>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} lg={4}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3, lg: 4 } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  mb: 3 
                }}
              >
                System Status
              </Typography>
              
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Database</Typography>
                  <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>100%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} color="success" sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>API Services</Typography>
                  <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>100%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} color="success" sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Storage</Typography>
                  <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>65%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={65} color="warning" sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard