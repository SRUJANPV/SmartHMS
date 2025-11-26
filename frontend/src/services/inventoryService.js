import api from './api'

const inventoryService = {
  // Inventory CRUD
  getInventory: async (params = {}) => {
    const response = await api.get('/inventory', { params })
    return response.data
  },

  getInventoryItem: async (id) => {
    const response = await api.get(`/inventory/${id}`)
    return response.data
  },

  createInventoryItem: async (itemData) => {
    const response = await api.post('/inventory', itemData)
    return response.data
  },

  updateInventoryItem: async (id, itemData) => {
    const response = await api.put(`/inventory/${id}`, itemData)
    return response.data
  },

  deleteInventoryItem: async (id) => {
    const response = await api.delete(`/inventory/${id}`)
    return response.data
  },

  // Stock Management
  updateStock: async (id, quantityChange, reason = '') => {
    const response = await api.patch(`/inventory/${id}/stock`, {
      quantityChange,
      reason
    })
    return response.data
  },

  // Inventory Stats
  getInventoryStats: async () => {
    const response = await api.get('/inventory/stats')
    return response.data
  },

  // Low Stock Alerts
  getLowStockItems: async () => {
    const response = await api.get('/inventory/low-stock')
    return response.data
  },

  // Expiring Items
  getExpiringItems: async (days = 30) => {
    const response = await api.get(`/inventory/expiring?days=${days}`)
    return response.data
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/inventory/categories')
    return response.data
  }
}

export default inventoryService