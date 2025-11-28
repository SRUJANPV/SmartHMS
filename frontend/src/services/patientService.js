import api from './api'

const patientService = {
  // Patient CRUD
  getPatients: async (params = {}) => {
    const response = await api.get('/patients', { params })
    return response.data.data
  },

  getPatient: async (id) => {
    const response = await api.get(`/patients/${id}`)
    return response.data.data
  },

  createPatient: async (patientData) => {
    const response = await api.post('/patients', patientData)
    return response.data.data
  },

  updatePatient: async (id, patientData) => {
    const response = await api.put(`/patients/${id}`, patientData)
    return response.data.data
  },

  deletePatient: async (id) => {
    const response = await api.delete(`/patients/${id}`)
    return response.data.data
  },

  // Patient Stats
  getPatientStats: async () => {
    const response = await api.get('/patients/stats')
    return response.data.data
  },

  // Document Upload
  uploadDocument: async (patientId, formData) => {
    const response = await api.post(`/patients/${patientId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  }
}

export default patientService