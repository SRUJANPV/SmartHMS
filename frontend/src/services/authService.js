import api from './api'

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data.data // Backend returns { success, message, data }
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data.data // Backend returns { success, message, data }
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data.data // Backend returns { success, message, data }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData)
    return response.data
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken })
    return response.data.data // Backend returns { success, message, data }
  }
}

export default authService
