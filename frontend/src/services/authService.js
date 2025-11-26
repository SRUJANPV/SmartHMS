// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'Admin@123',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1234567890',
    role: { id: 1, name: 'Admin' }
  },
  {
    id: '2',
    email: 'doctor@example.com',
    password: 'Doctor@123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567891',
    role: { id: 2, name: 'Doctor' }
  },
  {
    id: '3',
    email: 'patient@example.com',
    password: 'Patient@123',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1234567892',
    role: { id: 3, name: 'Patient' }
  }
]

const authService = {
  login: async (email, password) => {
    try {
      console.log('AuthService.login - email:', email)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock login
      const user = mockUsers.find(u => u.email === email && u.password === password)
      if (!user) {
        throw new Error('Invalid email or password')
      }
      
      const token = 'mock_token_' + Date.now()
      const refreshToken = 'mock_refresh_' + Date.now()
      
      return {
        data: {
          user: { ...user, password: undefined },
          token,
          refreshToken
        }
      }
    } catch (error) {
      console.error('AuthService.login - error:', error)
      throw error
    }
  },

  register: async (userData) => {
    try {
      console.log('AuthService.register - sending data:', userData)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check if user already exists
      const userExists = mockUsers.find(u => u.email === userData.email)
      if (userExists) {
        throw new Error('User with this email already exists')
      }
      
      // Create new user
      const newUser = {
        id: 'user_' + Date.now(),
        ...userData,
        role: { id: 3, name: userData.role || 'Patient' }
      }
      
      mockUsers.push(newUser)
      
      const token = 'mock_token_' + Date.now()
      const refreshToken = 'mock_refresh_' + Date.now()
      
      const response = {
        data: {
          user: { ...newUser, password: undefined },
          token,
          refreshToken
        }
      }
      console.log('AuthService.register - response:', response)
      return response
    } catch (error) {
      console.error('AuthService.register - error:', error)
      throw error
    }
  },

  getMe: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Find user by token (in mock, we'll just return the first user)
      const user = mockUsers[0]
      return {
        data: { ...user, password: undefined }
      }
    } catch (error) {
      console.error('AuthService.getMe - error:', error)
      throw error
    }
  },

  logout: async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  },

  changePassword: async (passwordData) => {
    try {
      console.log('AuthService.changePassword - changing password')
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        data: { success: true }
      }
    } catch (error) {
      console.error('AuthService.changePassword - error:', error)
      throw error
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const token = 'mock_token_' + Date.now()
      const newRefreshToken = 'mock_refresh_' + Date.now()
      
      return {
        data: {
          token,
          refreshToken: newRefreshToken
        }
      }
    } catch (error) {
      console.error('AuthService.refreshToken - error:', error)
      throw error
    }
  }
}

export default authService