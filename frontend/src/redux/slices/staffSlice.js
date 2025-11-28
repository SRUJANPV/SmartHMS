import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const getStaffList = createAsyncThunk(
  'staff/getStaffList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/patients/list/staff')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch staff list'
      )
    }
  }
)

const initialState = {
  doctors: [],
  staff: [],
  allStaff: [],
  isLoading: false,
  error: null
}

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStaffList.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getStaffList.fulfilled, (state, action) => {
        state.isLoading = false
        state.doctors = action.payload.doctors || []
        state.staff = action.payload.staff || []
        state.allStaff = action.payload.all || []
      })
      .addCase(getStaffList.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError } = staffSlice.actions
export default staffSlice.reducer
