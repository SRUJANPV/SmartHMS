import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import inventoryService from '../../services/inventoryService'

// Async thunks
export const getInventory = createAsyncThunk(
  'inventory/getInventory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getInventory(params)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getInventoryItem = createAsyncThunk(
  'inventory/getInventoryItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getInventoryItem(id)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createInventoryItem = createAsyncThunk(
  'inventory/createInventoryItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await inventoryService.createInventoryItem(itemData)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateInventoryItem = createAsyncThunk(
  'inventory/updateInventoryItem',
  async ({ id, itemData }, { rejectWithValue }) => {
    try {
      const response = await inventoryService.updateInventoryItem(id, itemData)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteInventoryItem = createAsyncThunk(
  'inventory/deleteInventoryItem',
  async (id, { rejectWithValue }) => {
    try {
      await inventoryService.deleteInventoryItem(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ id, quantityChange }, { rejectWithValue }) => {
    try {
      const response = await inventoryService.updateStock(id, quantityChange)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getInventoryStats = createAsyncThunk(
  'inventory/getInventoryStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getInventoryStats()
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getLowStockItems = createAsyncThunk(
  'inventory/getLowStockItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getLowStockItems()
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getExpiringItems = createAsyncThunk(
  'inventory/getExpiringItems',
  async (days = 30, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getExpiringItems(days)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Slice
const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    inventory: [],
    currentItem: null,
    lowStockItems: [],
    expiringItems: [],
    stats: {
      totalItems: 0,
      lowStockItems: 0,
      totalValue: 0
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
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Inventory
      .addCase(getInventory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.isLoading = false
        state.inventory = action.payload.items
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        }
      })
      .addCase(getInventory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Inventory Item
      .addCase(getInventoryItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentItem = action.payload
      })
      .addCase(getInventoryItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Create Inventory Item
      .addCase(createInventoryItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.inventory.unshift(action.payload)
        state.stats.totalItems += 1
      })
      .addCase(createInventoryItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update Inventory Item
      .addCase(updateInventoryItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.inventory.findIndex(i => i.id === action.payload.id)
        if (index !== -1) {
          state.inventory[index] = action.payload
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload
        }
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Delete Inventory Item
      .addCase(deleteInventoryItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.inventory = state.inventory.filter(i => i.id !== action.payload)
        state.stats.totalItems -= 1
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update Stock
      .addCase(updateStock.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.inventory.findIndex(i => i.id === action.payload.id)
        if (index !== -1) {
          state.inventory[index] = action.payload
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload
        }
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Inventory Stats
      .addCase(getInventoryStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getInventoryStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
      })
      .addCase(getInventoryStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Low Stock Items
      .addCase(getLowStockItems.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getLowStockItems.fulfilled, (state, action) => {
        state.isLoading = false
        state.lowStockItems = action.payload
      })
      .addCase(getLowStockItems.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Expiring Items
      .addCase(getExpiringItems.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getExpiringItems.fulfilled, (state, action) => {
        state.isLoading = false
        state.expiringItems = action.payload
      })
      .addCase(getExpiringItems.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError, setCurrentItem } = inventorySlice.actions
export default inventorySlice.reducer