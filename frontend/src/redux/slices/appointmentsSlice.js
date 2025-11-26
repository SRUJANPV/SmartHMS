import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import appointmentService from '../../services/appointmentService'

// Async thunks
export const getAppointments = createAsyncThunk(
  'appointments/getAppointments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointments(params)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getAppointmentById = createAsyncThunk(
  'appointments/getAppointmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentById(id)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await appointmentService.createAppointment(appointmentData)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ id, appointmentData }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.updateAppointment(id, appointmentData)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateAppointmentStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.updateAppointmentStatus(id, status)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getAppointmentStats = createAsyncThunk(
  'appointments/getAppointmentStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentStats()
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getDoctorSchedule = createAsyncThunk(
  'appointments/getDoctorSchedule',
  async ({ doctorId, date }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getDoctorSchedule(doctorId, date)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getAvailableSlots = createAsyncThunk(
  'appointments/getAvailableSlots',
  async ({ doctorId, date }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAvailableSlots(doctorId, date)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Slice
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    currentAppointment: null,
    stats: {
      total: 0,
      today: 0,
      upcoming: 0,
      completedToday: 0,
      uniquePatients: 0
    },
    doctorSchedule: [],
    availableSlots: [],
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentAppointment: (state, action) => {
      state.currentAppointment = action.payload
    },
    clearSchedule: (state) => {
      state.doctorSchedule = []
      state.availableSlots = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Appointments
      .addCase(getAppointments.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.isLoading = false
        state.appointments = action.payload.appointments
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        }
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Appointment By Id
      .addCase(getAppointmentById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentAppointment = action.payload
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false
        state.appointments.unshift(action.payload)
        state.stats.total += 1
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update Appointment
      .addCase(updateAppointment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.appointments.findIndex(a => a.id === action.payload.id)
        if (index !== -1) {
          state.appointments[index] = action.payload
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update Appointment Status
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.appointments.findIndex(a => a.id === action.payload.id)
        if (index !== -1) {
          state.appointments[index] = action.payload
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Appointment Stats
      .addCase(getAppointmentStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAppointmentStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
      })
      .addCase(getAppointmentStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Doctor Schedule
      .addCase(getDoctorSchedule.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getDoctorSchedule.fulfilled, (state, action) => {
        state.isLoading = false
        state.doctorSchedule = action.payload
      })
      .addCase(getDoctorSchedule.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Available Slots
      .addCase(getAvailableSlots.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAvailableSlots.fulfilled, (state, action) => {
        state.isLoading = false
        state.availableSlots = action.payload
      })
      .addCase(getAvailableSlots.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError, setCurrentAppointment, clearSchedule } = appointmentsSlice.actions
export default appointmentsSlice.reducer