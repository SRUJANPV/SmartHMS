import React, { useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

import { getPatientStats } from '../../redux/slices/patientsSlice'
import { getAppointmentStats } from '../../redux/slices/appointmentsSlice'
import { getBillingStats } from '../../redux/slices/billingSlice'
import { getInventoryStats } from '../../redux/slices/inventorySlice'

const Analytics = () => {
  const dispatch = useDispatch()
  
  const { stats: patientStats } = useSelector((state) => state.patients)
  const { stats: appointmentStats } = useSelector((state) => state.appointments)
  const { stats: billingStats } = useSelector((state) => state.billing)
  const { stats: inventoryStats } = useSelector((state) => state.inventory)

  const [dateRange, setDateRange] = React.useState({
    start: dayjs().subtract(1, 'month'),
    end: dayjs()
  })
  const [period, setPeriod] = React.useState('month')

  useEffect(() => {
    dispatch(getPatientStats())
    dispatch(getAppointmentStats())
    dispatch(getBillingStats())
    dispatch(getInventoryStats())
  }, [dispatch])

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, patients: 120 },
    { month: 'Feb', revenue: 52000, patients: 145 },
    { month: 'Mar', revenue: 48000, patients: 130 },
    { month: 'Apr', revenue: 61000, patients: 165 },
    { month: 'May', revenue: 55000, patients: 150 },
    { month: 'Jun', revenue: 68000, patients: 180 }
  ]

  const appointmentData = [
    { day: 'Mon', scheduled: 12, completed: 10 },
    { day: 'Tue', scheduled: 15, completed: 14 },
    { day: 'Wed', scheduled: 18, completed: 16 },
    { day: 'Thu', scheduled: 14, completed: 13 },
    { day: 'Fri', scheduled: 16, completed: 15 },
    { day: 'Sat', scheduled: 8, completed: 7 },
    { day: 'Sun', scheduled: 4, completed: 3 }
  ]

  const patientDemographics = [
    { name: '18-30', value: 35 },
    { name: '31-45', value: 40 },
    { name: '46-60', value: 18 },
    { name: '60+', value: 7 }
  ]

  const inventoryData = [
    { name: 'Medication', value: 45 },
    { name: 'Supplies', value: 25 },
    { name: 'Equipment', value: 15 },
    { name: 'Lab Items', value: 10 },
    { name: 'Other', value: 5 }
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Analytics & Reports
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              label="Period"
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From"
              value={dateRange.start}
              onChange={(newValue) => setDateRange(prev => ({ ...prev, start: newValue }))}
              slotProps={{ textField: { size: 'small', sx: { width: 130 } } }}
            />
            <DatePicker
              label="To"
              value={dateRange.end}
              onChange={(newValue) => setDateRange(prev => ({ ...prev, end: newValue }))}
              slotProps={{ textField: { size: 'small', sx: { width: 130 } } }}
            />
          </LocalizationProvider>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="overline">
                Total Revenue
              </Typography>
              <Typography variant="h4" component="div" color="primary.main">
                ${billingStats?.totalRevenue?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="success.main">
                +12.5% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="overline">
                Total Patients
              </Typography>
              <Typography variant="h4" component="div">
                {patientStats?.total || 0}
              </Typography>
              <Typography variant="body2" color="success.main">
                +8.2% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="overline">
                Appointments
              </Typography>
              <Typography variant="h4" component="div">
                {appointmentStats?.total || 0}
              </Typography>
              <Typography variant="body2" color="success.main">
                +15.3% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="overline">
                Inventory Value
              </Typography>
              <Typography variant="h4" component="div">
                ${inventoryStats?.totalValue?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="warning.main">
                {inventoryStats?.lowStock || 0} low stock items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Revenue vs Patients Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Revenue & Patient Growth
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                <Bar yAxisId="right" dataKey="patients" fill="#82ca9d" name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Patient Demographics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Patient Age Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={patientDemographics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {patientDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Appointment Trends */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Weekly Appointments
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="scheduled" stroke="#8884d8" strokeWidth={2} name="Scheduled" />
                <Line type="monotone" dataKey="completed" stroke="#82ca9d" strokeWidth={2} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Inventory Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 350 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Inventory by Category
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Doctor Performance */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Doctor Performance Metrics
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart
                data={[
                  { name: 'Dr. Smith', appointments: 45, revenue: 25000, satisfaction: 4.8 },
                  { name: 'Dr. Johnson', appointments: 38, revenue: 22000, satisfaction: 4.9 },
                  { name: 'Dr. Williams', appointments: 42, revenue: 24000, satisfaction: 4.7 },
                  { name: 'Dr. Brown', appointments: 35, revenue: 19000, satisfaction: 4.6 },
                  { name: 'Dr. Davis', appointments: 28, revenue: 16000, satisfaction: 4.5 }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="appointments" fill="#8884d8" name="Appointments" />
                <Bar yAxisId="left" dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                <Bar yAxisId="right" dataKey="satisfaction" fill="#ffc658" name="Satisfaction" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Analytics