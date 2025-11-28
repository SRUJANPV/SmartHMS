import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import patientsReducer from './slices/patientsSlice'
import appointmentsReducer from './slices/appointmentsSlice'
import billingReducer from './slices/billingSlice'
import inventoryReducer from './slices/inventorySlice'
import staffReducer from './slices/staffSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
    appointments: appointmentsReducer,
    billing: billingReducer,
    inventory: inventoryReducer,
    staff: staffReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
})

export default store