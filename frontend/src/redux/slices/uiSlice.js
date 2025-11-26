import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    loading: false,
    snackbar: {
      open: false,
      message: '',
      severity: 'info'
    },
    modal: {
      open: false,
      type: null,
      data: null
    }
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    showSnackbar: (state, action) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info'
      }
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false
    },
    openModal: (state, action) => {
      state.modal = {
        open: true,
        type: action.payload.type,
        data: action.payload.data
      }
    },
    closeModal: (state) => {
      state.modal = {
        open: false,
        type: null,
        data: null
      }
    }
  }
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  showSnackbar,
  hideSnackbar,
  openModal,
  closeModal
} = uiSlice.actions

export default uiSlice.reducer