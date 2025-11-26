import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as patientService from '../../services/patientService'

// Async thunks
export const getPatients = createAsyncThunk(
  'patients/getPatients',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatients(params)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getPatientById = createAsyncThunk(
  'patients/getPatientById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatientById(id)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      const response = await patientService.createPatient(patientData)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, patientData }, { rejectWithValue }) => {
    try {
      const response = await patientService.updatePatient(id, patientData)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id, { rejectWithValue }) => {
    try {
      await patientService.deletePatient(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getPatientStats = createAsyncThunk(
  'patients/getPatientStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatientStats()
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Slice
const patientsSlice = createSlice({
  name: 'patients',
  initialState: {
    patients: [],
    currentPatient: null,
    stats: {
      total: 0,
      active: 0,
      newThisMonth: 0
    },
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
    setCurrentPatient: (state, action) => {
      state.currentPatient = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Patients
      .addCase(getPatients.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.isLoading = false
        state.patients = action.payload.patients
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        }
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Patient By Id
      .addCase(getPatientById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPatientById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentPatient = action.payload
      })
      .addCase(getPatientById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Create Patient
      .addCase(createPatient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isLoading = false
        state.patients.unshift(action.payload)
        state.stats.total += 1
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update Patient
      .addCase(updatePatient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.patients.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.patients[index] = action.payload
        }
        if (state.currentPatient?.id === action.payload.id) {
          state.currentPatient = action.payload
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Delete Patient
      .addCase(deletePatient.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isLoading = false
        state.patients = state.patients.filter(p => p.id !== action.payload)
        state.stats.total -= 1
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Patient Stats
      .addCase(getPatientStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPatientStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
      })
      .addCase(getPatientStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError, setCurrentPatient } = patientsSlice.actions
export default patientsSlice.reducer