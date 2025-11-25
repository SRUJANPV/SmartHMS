import api from './api'

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken })
    }
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData)
    return response
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken })
    return response
  }
}

export default authService