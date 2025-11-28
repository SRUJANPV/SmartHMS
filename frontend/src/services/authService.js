import api from './api'

const authService = {
  login: async (email, password) => {
    try {
      console.log('AuthService.login - email:', email)
      const response = await api.post('/auth/login', { email, password })
      console.log('AuthService.login - response:', response)
      return response
    } catch (error) {
      console.error('AuthService.login - error:', error)
      throw error
    }
  },

  register: async (userData) => {
    try {
      console.log('AuthService.register - sending data:', userData)
      const response = await api.post('/auth/register', userData)
      console.log('AuthService.register - response:', response)
      return response
    } catch (error) {
      console.error('AuthService.register - error:', error)
      throw error
    }
  },

  getMe: async () => {
    try {
      const response = await api.get('/auth/me')
      return response
    } catch (error) {
      console.error('AuthService.getMe - error:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken })
      }
    } catch (error) {
      console.error('AuthService.logout - error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  },

  changePassword: async (passwordData) => {
    try {
      console.log('AuthService.changePassword - changing password')
      const response = await api.post('/auth/change-password', passwordData)
      return response
    } catch (error) {
      console.error('AuthService.changePassword - error:', error)
      throw error
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken })
      return response
    } catch (error) {
      console.error('AuthService.refreshToken - error:', error)
      throw error
    }
  }
}

export default authService
