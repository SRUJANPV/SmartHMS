import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken
        })

        const { token, refreshToken: newRefreshToken } = response.data.data

        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Dashboard API calls
export const getDashboardStats = async () => {
  try {
    const [patientsRes, appointmentsRes, billingRes, inventoryRes] = await Promise.all([
      api.get('/patients/stats'),
      api.get('/appointments/stats'),
      api.get('/billing/stats'),
      api.get('/inventory/stats')
    ])

    return {
      patients: {
        totalPatients: patientsRes.data?.data?.total || 0,
        change: 0
      },
      appointments: {
        todayAppointments: appointmentsRes.data?.data?.today || 0,
        upcoming: appointmentsRes.data?.data?.upcoming || 0
      },
      billing: {
        monthlyRevenue: billingRes.data?.data?.totalRevenue || 0,
        pendingBills: billingRes.data?.data?.pendingBills || 0
      },
      inventory: {
        lowStockItems: inventoryRes.data?.data?.lowStockItems || 0,
        totalItems: inventoryRes.data?.data?.totalItems || 0
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}

// Get recent appointments
export const getRecentAppointments = async (limit = 5) => {
  try {
    const response = await api.get('/appointments', { params: { limit, page: 1, sort: '-appointmentDate' } })
    return response.data?.data?.rows || []
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return []
  }
}

// Get recent patients
export const getRecentPatients = async (limit = 5) => {
  try {
    const response = await api.get('/patients', { params: { limit, page: 1 } })
    return response.data?.data?.rows || []
  } catch (error) {
    console.error('Error fetching patients:', error)
    return []
  }
}

// Get low stock items
export const getLowStockItems = async (limit = 5) => {
  try {
    const response = await api.get('/inventory/low-stock', { params: { limit, page: 1 } })
    return response.data?.data?.rows || []
  } catch (error) {
    console.error('Error fetching low stock items:', error)
    return []
  }
}

export default api