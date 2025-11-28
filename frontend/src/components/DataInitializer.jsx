import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getPatients } from '../redux/slices/patientsSlice'
import { getAppointments, getAppointmentStats } from '../redux/slices/appointmentsSlice'
import { getBills, getBillingStats } from '../redux/slices/billingSlice'
import { getInventory, getInventoryStats } from '../redux/slices/inventorySlice'
import { getStaffList } from '../redux/slices/staffSlice'

/**
 * DataInitializer - Loads all critical data from the database on app mount
 * This ensures that all dropdowns and lists are populated with actual database data
 */
const DataInitializer = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Load all data in parallel for efficiency
    const initializeData = async () => {
      try {
        // Dispatch all data fetching actions
        dispatch(getPatients())
        dispatch(getAppointments())
        dispatch(getAppointmentStats())
        dispatch(getBills())
        dispatch(getBillingStats())
        dispatch(getInventory())
        dispatch(getInventoryStats())
        dispatch(getStaffList())
      } catch (error) {
        console.error('Error initializing data:', error)
      }
    }

    initializeData()
  }, [dispatch])

  return children
}

export default DataInitializer
