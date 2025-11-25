import api from './api'

const patientService = {
  // Patient CRUD
  getPatients: async (params = {}) => {
    const response = await api.get('/patients', { params })
    return response
  },

  getPatient: async (id) => {
    const response = await api.get(`/patients/${id}`)
    return response
  },

  createPatient: async (patientData) => {
    const response = await api.post('/patients', patientData)
    return response
  },

  updatePatient: async (id, patientData) => {
    const response = await api.put(`/patients/${id}`, patientData)
    return response
  },

  deletePatient: async (id) => {
    const response = await api.delete(`/patients/${id}`)
    return response
  },

  // Patient Stats
  getPatientStats: async () => {
    const response = await api.get('/patients/stats')
    return response
  },

  // Document Upload
  uploadDocument: async (patientId, formData) => {
    const response = await api.post(`/patients/${patientId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  }
}

export default patientService