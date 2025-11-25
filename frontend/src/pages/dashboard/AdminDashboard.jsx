import React, { useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress
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

const AdminDashboard = () => {
  // const dispatch = useDispatch()
  const { stats: patientStats } = useSelector((state) => state.patients)
  const { stats: appointmentStats } = useSelector((state) => state.appointments)
  const { stats: billingStats } = useSelector((state) => state.billing)
  const { stats: inventoryStats } = useSelector((state) => state.inventory)

  // Currently there are no patient/appointment/billing/inventory slices in the redux store
  // so we don't dispatch any actions here. If these slices are later added, re-enable.
  useEffect(() => {}, [])

  const statCards = [
    {
      title: 'Total Patients',
      value: patientStats?.total || 0,
      icon: <PeopleIcon />,
      color: '#1976d2',
      change: '+12%'
    },
    {
      title: "Today's Appointments",
      value: appointmentStats?.today || 0,
      icon: <CalendarIcon />,
      color: '#2e7d32',
      change: '+5%'
    },
    {
      title: 'Monthly Revenue',
      value: `$${billingStats?.monthlyRevenue || 0}`,
      icon: <BillingIcon />,
      color: '#ed6c02',
      change: '+18%'
    },
    {
      title: 'Low Stock Items',
      value: inventoryStats?.lowStockCount || 0,
      icon: <InventoryIcon />,
      color: '#d32f2f',
      change: '-3%'
    }
  ]

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Welcome to SmartCare HMS Administration Panel
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <RecentActivity />
          </Paper>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Database</Typography>
                  <Typography variant="body2">100%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} color="success" />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">API Services</Typography>
                  <Typography variant="body2">100%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} color="success" />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Storage</Typography>
                  <Typography variant="body2">65%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={65} color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard