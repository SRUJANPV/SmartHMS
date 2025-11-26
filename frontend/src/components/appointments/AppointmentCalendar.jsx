import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'

const AppointmentCalendar = ({ onScheduleAppointment }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { appointments } = useSelector((state) => state.appointments)

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getAppointmentsForDate = (day) => {
    if (!day) return []

    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return appointments.filter(apt => apt.appointmentDate === dateString)
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setMonth(newDate.getMonth() + direction)
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <Paper sx={{ p: 3 }}>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={goToToday} variant="outlined" size="small">
            Today
          </Button>
          <Button onClick={() => navigateMonth(-1)} variant="outlined" size="small">
            <ChevronLeftIcon />
          </Button>
          <Button onClick={() => navigateMonth(1)} variant="outlined" size="small">
            <ChevronRightIcon />
          </Button>
        </Box>
      </Box>

      {/* Week Days Header */}
      <Grid container spacing={0} sx={{ mb: 1 }}>
        {weekDays.map((day) => (
          <Grid item xs={12/7} key={day}>
            <Typography
              variant="subtitle2"
              sx={{
                textAlign: 'center',
                py: 1,
                fontWeight: 'bold',
                color: 'text.secondary'
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Grid */}
      <Grid container spacing={0}>
        {days.map((day, index) => {
          const dayAppointments = getAppointmentsForDate(day)
          const isToday = day === new Date().getDate() &&
                         currentDate.getMonth() === new Date().getMonth() &&
                         currentDate.getFullYear() === new Date().getFullYear()

          return (
            <Grid item xs={12/7} key={index}>
              <Card
                sx={{
                  height: 120,
                  m: 0.5,
                  cursor: day ? 'pointer' : 'default',
                  bgcolor: isToday ? 'primary.light' : 'background.paper',
                  '&:hover': day ? { bgcolor: 'action.hover' } : {},
                  opacity: day ? 1 : 0
                }}
                onClick={() => day && onScheduleAppointment && onScheduleAppointment({
                  appointmentDate: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                })}
              >
                <CardContent sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isToday ? 'bold' : 'normal',
                      color: isToday ? 'primary.contrastText' : 'text.primary',
                      mb: 0.5
                    }}
                  >
                    {day}
                  </Typography>

                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    {dayAppointments.slice(0, 2).map((appointment, aptIndex) => (
                      <Chip
                        key={aptIndex}
                        label={`${appointment.appointmentTime} - ${appointment.patient?.firstName}`}
                        size="small"
                        sx={{
                          width: '100%',
                          mb: 0.5,
                          fontSize: '0.7rem',
                          height: '20px'
                        }}
                        color={appointment.status === 'completed' ? 'success' : 'primary'}
                      />
                    ))}
                    {dayAppointments.length > 2 && (
                      <Typography variant="caption" color="text.secondary">
                        +{dayAppointments.length - 2} more
                      </Typography>
                    )}
                  </Box>

                  {day && (
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      sx={{
                        mt: 'auto',
                        minHeight: '24px',
                        fontSize: '0.7rem',
                        p: 0.5
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onScheduleAppointment && onScheduleAppointment({
                          appointmentDate: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        })
                      }}
                    >
                      Add
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Legend */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip size="small" color="primary" sx={{ mr: 1 }} />
          <Typography variant="caption">Scheduled</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip size="small" color="success" sx={{ mr: 1 }} />
          <Typography variant="caption">Completed</Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default AppointmentCalendar