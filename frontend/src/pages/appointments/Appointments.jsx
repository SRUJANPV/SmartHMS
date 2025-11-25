import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  ViewWeek as WeekViewIcon,
  ViewDay as DayViewIcon,
  List as ListViewIcon
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import dayjs from 'dayjs'

import AppointmentForm from '../../components/appointments/AppointmentForm'
import AppointmentCalendar from '../../components/appointments/AppointmentCalendar'
import { getAppointments, getAppointmentStats } from '../../redux/slices/appointmentsSlice'

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`appointment-tabpanel-${index}`}
    aria-labelledby={`appointment-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
)

const Appointments = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  
  const { appointments, stats, isLoading } = useSelector((state) => state.appointments)
  
  const [tabValue, setTabValue] = useState(0)
  const [viewMode, setViewMode] = useState('calendar')
  const [openForm, setOpenForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(dayjs())

  useEffect(() => {
    dispatch(getAppointments())
    dispatch(getAppointmentStats())
  }, [dispatch])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const statusChips = {
    scheduled: { color: 'primary', label: 'Scheduled' },
    confirmed: { color: 'success', label: 'Confirmed' },
    in_progress: { color: 'warning', label: 'In Progress' },
    completed: { color: 'info', label: 'Completed' },
    cancelled: { color: 'error', label: 'Cancelled' },
    no_show: { color: 'default', label: 'No Show' }
  }

  const priorityChips = {
    low: { color: 'success', label: 'Low' },
    medium: { color: 'warning', label: 'Medium' },
    high: { color: 'error', label: 'High' },
    emergency: { color: 'error', label: 'Emergency' }
  }

  const todayAppointments = appointments.filter(apt => 
    dayjs(apt.appointmentDate).isSame(dayjs(), 'day')
  )

  const upcomingAppointments = appointments.filter(apt => 
    dayjs(apt.appointmentDate).isAfter(dayjs(), 'day')
  )

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Appointment Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          New Appointment
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today's Appointments
              </Typography>
              <Typography variant="h4" component="div">
                {stats?.today || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                This Week
              </Typography>
              <Typography variant="h4" component="div">
                {stats?.thisWeek || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" component="div">
                {stats?.pending || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4" component="div">
                {stats?.completed || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* View Mode Toggle */}
      <Paper sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Calendar View" />
            <Tab label="Today's Appointments" />
            <Tab label="Upcoming Appointments" />
          </Tabs>
          
          <Box>
            <IconButton
              color={viewMode === 'calendar' ? 'primary' : 'default'}
              onClick={() => setViewMode('calendar')}
            >
              <CalendarIcon />
            </IconButton>
            <IconButton
              color={viewMode === 'list' ? 'primary' : 'default'}
              onClick={() => setViewMode('list')}
            >
              <ListViewIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <AppointmentCalendar
          appointments={appointments}
          onDateSelect={setSelectedDate}
          onAppointmentClick={(appointment) => {
            // Handle appointment click
            console.log('Appointment clicked:', appointment)
          }}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2}>
          {todayAppointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </Typography>
                    <Box>
                      <Chip
                        label={statusChips[appointment.status]?.label}
                        color={statusChips[appointment.status]?.color}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={priorityChips[appointment.priority]?.label}
                        color={priorityChips[appointment.priority]?.color}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  
                  <Typography color="textSecondary" gutterBottom>
                    Doctor: {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    Time: {dayjs(appointment.appointmentDate).format('MMM D, YYYY')} at {appointment.appointmentTime}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    Reason: {appointment.reason}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {todayAppointments.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No appointments scheduled for today
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={2}>
          {upcomingAppointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </Typography>
                    <Chip
                      label={statusChips[appointment.status]?.label}
                      color={statusChips[appointment.status]?.color}
                      size="small"
                    />
                  </Box>
                  
                  <Typography color="textSecondary" gutterBottom>
                    Doctor: {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    {dayjs(appointment.appointmentDate).format('ddd, MMM D, YYYY')} at {appointment.appointmentTime}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    {appointment.reason}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Appointment Form Dialog */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Schedule New Appointment</DialogTitle>
        <DialogContent>
          <AppointmentForm
            onSuccess={() => {
              setOpenForm(false)
              enqueueSnackbar('Appointment scheduled successfully', { variant: 'success' })
            }}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default Appointments