import api from './api'

const appointmentService = {
  // Appointment CRUD
  getAppointments: async (params = {}) => {
    const response = await api.get('/appointments', { params })
    return response.data.data
  },

  getAppointment: async (id) => {
    const response = await api.get(`/appointments/${id}`)
    return response.data.data
  },

  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData)
    return response.data.data
  },

  updateAppointment: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData)
    return response.data.data
  },

  updateAppointmentStatus: async (id, status, notes = '') => {
    const response = await api.patch(`/appointments/${id}/status`, {
      status,
      notes
    })
    return response.data.data
  },

  // Appointment Stats
  getAppointmentStats: async () => {
    const response = await api.get('/appointments/stats')
    return response.data.data
  },

  // Doctor Schedule
  getDoctorSchedule: async (doctorId, date) => {
    const response = await api.get(`/appointments/doctor/${doctorId}/schedule`, {
      params: { date }
    })
    return response.data.data
  },

  // Available Slots
  getAvailableSlots: async (doctorId, date) => {
    const response = await api.get(`/appointments/doctor/${doctorId}/available-slots`, {
      params: { date }
    })
    return response.data.data
  },

  // Patient Appointments
  getPatientAppointments: async (patientId) => {
    const response = await api.get('/appointments', {
      params: { patientId }
    })
    return response.data.data
  },

  // Doctor Appointments
  getDoctorAppointments: async (doctorId, params = {}) => {
    const response = await api.get('/appointments', {
      params: { doctorId, ...params }
    })
    return response.data.data
  }
}

export default appointmentService