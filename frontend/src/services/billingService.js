import api from './api'

const billingService = {
  // Bill CRUD
  getBills: async (params = {}) => {
    const response = await api.get('/billing', { params })
    return response.data.data
  },

  getBill: async (id) => {
    const response = await api.get(`/billing/${id}`)
    return response.data.data
  },

  createBill: async (billData) => {
    const response = await api.post('/billing', billData)
    return response.data.data
  },

  updateBill: async (id, billData) => {
    const response = await api.put(`/billing/${id}`, billData)
    return response.data.data
  },

  deleteBill: async (id) => {
    const response = await api.delete(`/billing/${id}`)
    return response.data.data
  },

  // Bill Items
  addBillItem: async (billId, itemData) => {
    const response = await api.post(`/billing/${billId}/items`, itemData)
    return response.data.data
  },

  removeBillItem: async (billId, itemId) => {
    const response = await api.delete(`/billing/${billId}/items/${itemId}`)
    return response.data.data
  },

  // Bill Status
  updateBillStatus: async (id, status, notes = '') => {
    const response = await api.patch(`/billing/${id}/status`, {
      status,
      notes
    })
    return response.data.data
  },

  // Invoice PDF
  generateInvoicePdf: async (id) => {
    const response = await api.get(`/billing/${id}/invoice`, {
      responseType: 'blob'
    })
    return response.data
  },

  // Billing Stats
  getBillingStats: async () => {
    const response = await api.get('/billing/stats')
    return response.data.data
  },

  // Patient Bills
  getPatientBills: async (patientId) => {
    const response = await api.get('/billing', {
      params: { patientId }
    })
    return response.data.data
  },

  // Outstanding Bills
  getOutstandingBills: async () => {
    const response = await api.get('/billing', {
      params: { status: 'pending' }
    })
    return response.data.data
  },

  // Paid Bills
  getPaidBills: async (params = {}) => {
    const response = await api.get('/billing', {
      params: { status: 'paid', ...params }
    })
    return response.data.data
  }
}

export default billingService