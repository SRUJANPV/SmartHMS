import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import billingService from '../../services/billingService'

// Async thunks
export const getBills = createAsyncThunk(
  'billing/getBills',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await billingService.getBills(params)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getBillById = createAsyncThunk(
  'billing/getBillById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await billingService.getBillById(id)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createBill = createAsyncThunk(
  'billing/createBill',
  async (billData, { rejectWithValue }) => {
    try {
      const response = await billingService.createBill(billData)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateBill = createAsyncThunk(
  'billing/updateBill',
  async ({ id, billData }, { rejectWithValue }) => {
    try {
      const response = await billingService.updateBill(id, billData)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateBillStatus = createAsyncThunk(
  'billing/updateBillStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await billingService.updateBillStatus(id, status)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteBill = createAsyncThunk(
  'billing/deleteBill',
  async (id, { rejectWithValue }) => {
    try {
      await billingService.deleteBill(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const addBillItem = createAsyncThunk(
  'billing/addBillItem',
  async ({ billId, itemData }, { rejectWithValue }) => {
    try {
      const response = await billingService.addBillItem(billId, itemData)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const removeBillItem = createAsyncThunk(
  'billing/removeBillItem',
  async ({ billId, itemId }, { rejectWithValue }) => {
    try {
      const response = await billingService.removeBillItem(billId, itemId)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getBillingStats = createAsyncThunk(
  'billing/getBillingStats',
  async (period = 'month', { rejectWithValue }) => {
    try {
      const response = await billingService.getBillingStats(period)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const generateBillPDF = createAsyncThunk(
  'billing/generateBillPDF',
  async (billId, { rejectWithValue }) => {
    try {
      const response = await billingService.generateBillPDF(billId)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Slice
const billingSlice = createSlice({
  name: 'billing',
  initialState: {
    bills: [],
    currentBill: null,
    stats: {
      totalRevenue: 0,
      pendingBills: 0,
      paidBills: 0,
      monthlyRevenue: 0,
      revenueByMonth: []
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
    setCurrentBill: (state, action) => {
      state.currentBill = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Bills
      .addCase(getBills.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getBills.fulfilled, (state, action) => {
        state.isLoading = false
        state.bills = action.payload.bills
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        }
      })
      .addCase(getBills.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Bill By Id
      .addCase(getBillById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getBillById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentBill = action.payload
      })
      .addCase(getBillById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Create Bill
      .addCase(createBill.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.isLoading = false
        state.bills.unshift(action.payload)
        state.stats.pendingBills += 1
      })
      .addCase(createBill.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update Bill
      .addCase(updateBill.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.bills.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.bills[index] = action.payload
        }
        if (state.currentBill?.id === action.payload.id) {
          state.currentBill = action.payload
        }
      })
      .addCase(updateBill.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update Bill Status
      .addCase(updateBillStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBillStatus.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.bills.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.bills[index] = action.payload
        }
        if (state.currentBill?.id === action.payload.id) {
          state.currentBill = action.payload
        }
        // Update stats
        if (action.payload.status === 'paid') {
          state.stats.pendingBills -= 1
          state.stats.paidBills += 1
        }
      })
      .addCase(updateBillStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Delete Bill
      .addCase(deleteBill.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.isLoading = false
        state.bills = state.bills.filter(b => b.id !== action.payload)
        state.stats.pendingBills -= 1
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Add Bill Item
      .addCase(addBillItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addBillItem.fulfilled, (state, action) => {
        state.isLoading = false
        // Update current bill if it's the one being modified
        if (state.currentBill && state.currentBill.id === action.payload.billId) {
          state.currentBill.items.push(action.payload)
        }
      })
      .addCase(addBillItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Remove Bill Item
      .addCase(removeBillItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removeBillItem.fulfilled, (state, action) => {
        state.isLoading = false
        // Update current bill if it's the one being modified
        if (state.currentBill && state.currentBill.id === action.payload.billId) {
          state.currentBill.items = state.currentBill.items.filter(item => item.id !== action.payload.id)
        }
      })
      .addCase(removeBillItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Billing Stats
      .addCase(getBillingStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getBillingStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = { ...state.stats, ...action.payload }
      })
      .addCase(getBillingStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Generate Bill PDF
      .addCase(generateBillPDF.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(generateBillPDF.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle PDF generation success
      })
      .addCase(generateBillPDF.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError, setCurrentBill } = billingSlice.actions
export default billingSlice.reducer