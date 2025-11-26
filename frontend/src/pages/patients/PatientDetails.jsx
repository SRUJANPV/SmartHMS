import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  Tab,
  Tabs
} from '@mui/material'
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  Receipt as BillingIcon
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PatientDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)
  const [patient, setPatient] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [bills, setBills] = useState([])
  const [medicalRecords, setMedicalRecords] = useState([])

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Fetch patient details
    setPatient({
      id: id,
      patientId: 'P001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      dateOfBirth: '1985-05-15',
      gender: 'Male',
      address: '123 Main St, City, State',
      emergencyContact: 'Jane Doe - +1234567891',
      bloodType: 'O+',
      allergies: 'Penicillin',
      createdAt: '2023-01-15'
    })

    // Mock appointments
    setAppointments([
      {
        id: 1,
        date: '2024-01-15',
        time: '10:00',
        doctor: 'Dr. Smith',
        type: 'General Checkup',
        status: 'completed'
      },
      {
        id: 2,
        date: '2024-01-20',
        time: '14:00',
        doctor: 'Dr. Johnson',
        type: 'Consultation',
        status: 'scheduled'
      }
    ])

    // Mock bills
    setBills([
      {
        id: 1,
        billNumber: 'B001',
        date: '2024-01-15',
        amount: 150.00,
        status: 'paid'
      },
      {
        id: 2,
        billNumber: 'B002',
        date: '2024-01-10',
        amount: 75.00,
        status: 'pending'
      }
    ])

    // Mock medical records
    setMedicalRecords([
      {
        id: 1,
        date: '2024-01-15',
        doctor: 'Dr. Smith',
        diagnosis: 'Common Cold',
        treatment: 'Rest and fluids',
        notes: 'Patient recovering well'
      }
    ])
  }, [id])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'scheduled': return 'primary'
      case 'cancelled': return 'error'
      case 'paid': return 'success'
      case 'pending': return 'warning'
      default: return 'default'
    }
  }

  if (!patient) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
            {patient.firstName[0]}{patient.lastName[0]}
          </Avatar>
          <Box>
            <Typography variant="h4">
              {patient.firstName} {patient.lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Patient ID: {patient.patientId}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/patients/${id}/edit`)}
        >
          Edit Patient
        </Button>
      </Box>

      {/* Patient Info Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                <Typography variant="body2">{patient.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                <Typography variant="body2">{patient.phone}</Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Address:</strong> {patient.address}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Emergency Contact:</strong> {patient.emergencyContact}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Gender:</strong> {patient.gender}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Blood Type:</strong> {patient.bloodType}
              </Typography>
              <Typography variant="body2">
                <strong>Allergies:</strong> {patient.allergies}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Medical Summary
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                <Typography variant="body2">
                  Last Visit: {appointments[0]?.date || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MedicalIcon sx={{ mr: 1, color: 'action.active' }} />
                <Typography variant="body2">
                  Total Records: {medicalRecords.length}
                </Typography>
              </Box>
              <Typography variant="body2">
                <strong>Patient Since:</strong> {new Date(patient.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Appointments" />
          <Tab label="Medical Records" />
          <Tab label="Billing" />
        </Tabs>

        {/* Appointments Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Appointment History
            </Typography>
            {appointments.map((appointment) => (
              <Card key={appointment.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1">
                        {appointment.date} at {appointment.time}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {appointment.doctor} - {appointment.type}
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
        )}

        {/* Medical Records Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Medical Records
            </Typography>
            {medicalRecords.map((record) => (
              <Card key={record.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {record.date} - {record.doctor}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Diagnosis:</strong> {record.diagnosis}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Treatment:</strong> {record.treatment}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Notes:</strong> {record.notes}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Billing Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Billing History
            </Typography>
            {bills.map((bill) => (
              <Card key={bill.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1">
                        Bill #{bill.billNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {bill.date}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6">
                        ${bill.amount}
                      </Typography>
                      <Chip
                        label={bill.status}
                        color={getStatusColor(bill.status)}
                        size="small"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default PatientDetails