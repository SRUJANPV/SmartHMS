/**
 * API Configuration and Testing
 * 
 * This file documents all the API endpoints used by the application
 * for fetching database data.
 */

// Base URL - automatically configured in axios instance
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

// API Endpoints for Database-Driven Data

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token'
  },

  // Patients - Core patient management
  PATIENTS: {
    GET_ALL: '/patients',
    CREATE: '/patients',
    GET_BY_ID: (id) => `/patients/${id}`,
    UPDATE: (id) => `/patients/${id}`,
    DELETE: (id) => `/patients/${id}`,
    GET_STATS: '/patients/stats',
    
    // New endpoint for fetching staff/doctors
    GET_STAFF: '/patients/list/staff'
  },

  // Appointments
  APPOINTMENTS: {
    GET_ALL: '/appointments',
    CREATE: '/appointments',
    GET_BY_ID: (id) => `/appointments/${id}`,
    UPDATE: (id) => `/appointments/${id}`,
    DELETE: (id) => `/appointments/${id}`,
    GET_STATS: '/appointments/stats'
  },

  // Billing
  BILLING: {
    GET_ALL: '/billing',
    CREATE: '/billing',
    GET_BY_ID: (id) => `/billing/${id}`,
    UPDATE: (id) => `/billing/${id}`,
    DELETE: (id) => `/billing/${id}`,
    GET_STATS: '/billing/stats'
  },

  // Inventory
  INVENTORY: {
    GET_ALL: '/inventory',
    CREATE: '/inventory',
    GET_BY_ID: (id) => `/inventory/${id}`,
    UPDATE: (id) => `/inventory/${id}`,
    DELETE: (id) => `/inventory/${id}`,
    GET_STATS: '/inventory/stats',
    GET_LOW_STOCK: '/inventory/low-stock'
  }
}

// Example API calls that are used throughout the application

export const apiExamples = {
  /**
   * Fetch all patients from database
   * Used in: Appointments, Billing, Patient pages
   */
  getPatients: () => `GET ${API_ENDPOINTS.PATIENTS.GET_ALL}`,

  /**
   * Fetch all doctors and staff from database
   * Used in: Appointments form, Staff selection dropdowns
   */
  getStaff: () => `GET ${API_ENDPOINTS.PATIENTS.GET_STAFF}`,

  /**
   * Fetch all appointments
   * Used in: Appointments page, Dashboard
   */
  getAppointments: () => `GET ${API_ENDPOINTS.APPOINTMENTS.GET_ALL}`,

  /**
   * Create new appointment with real patient and doctor IDs
   * Used in: Appointment form submission
   */
  createAppointment: () => `POST ${API_ENDPOINTS.APPOINTMENTS.CREATE}`,

  /**
   * Fetch all bills
   * Used in: Billing page, Dashboard
   */
  getBills: () => `GET ${API_ENDPOINTS.BILLING.GET_ALL}`,

  /**
   * Create new bill with real patient ID
   * Used in: Bill form submission
   */
  createBill: () => `POST ${API_ENDPOINTS.BILLING.CREATE}`,

  /**
   * Fetch all inventory items
   * Used in: Inventory page, Bill creation
   */
  getInventory: () => `GET ${API_ENDPOINTS.INVENTORY.GET_ALL}`
}

// Request/Response Examples

export const requestResponseExamples = {
  /**
   * Get Staff Response Example
   */
  getStaffResponse: {
    doctors: [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@hospital.com',
        phone: '555-1234',
        role: { name: 'Doctor' }
      },
      {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@hospital.com',
        phone: '555-5678',
        role: { name: 'Doctor' }
      }
    ],
    staff: [
      // Doctors and Staff members
    ],
    all: [
      // All active staff
    ]
  },

  /**
   * Get Patients Response Example
   */
  getPatientsResponse: {
    data: [
      {
        id: 1,
        patientId: 'PAT-001',
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james@example.com',
        phone: '555-9999',
        dateOfBirth: '1990-01-15',
        gender: 'Male',
        address: '123 Main St',
        bloodGroup: 'O+',
        status: 'active'
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 50
    }
  },

  /**
   * Get Appointments Response Example
   */
  getAppointmentsResponse: {
    data: [
      {
        id: 1,
        patientId: 1,
        doctorId: 1,
        appointmentDate: '2025-12-01',
        appointmentTime: '10:00',
        type: 'General Checkup',
        status: 'scheduled',
        notes: 'Follow-up checkup'
      }
    ],
    stats: {
      total: 45,
      today: 5,
      upcoming: 20,
      completed: 15,
      cancelled: 5
    }
  }
}

/**
 * Testing Checklist
 * 
 * Verify these API calls are working:
 * 
 * 1. [] GET /api/patients/list/staff - Returns doctors and staff
 * 2. [] GET /api/patients - Returns all patients
 * 3. [] GET /api/appointments - Returns all appointments
 * 4. [] GET /api/appointments/stats - Returns appointment statistics
 * 5. [] GET /api/billing - Returns all bills
 * 6. [] GET /api/billing/stats - Returns billing statistics
 * 7. [] GET /api/inventory - Returns all inventory items
 * 8. [] GET /api/inventory/stats - Returns inventory statistics
 * 
 * Redux Actions Dispatched on App Load:
 * 
 * 1. getCurrentUser() - Validates existing token
 * 2. getPatients() - Populates patients dropdown
 * 3. getAppointments() - Loads appointments
 * 4. getAppointmentStats() - Loads appointment stats
 * 5. getBills() - Loads billing data
 * 6. getBillingStats() - Loads billing stats
 * 7. getInventory() - Loads inventory items
 * 8. getInventoryStats() - Loads inventory stats
 * 9. getStaffList() - Loads doctors and staff (also on-demand in forms)
 */

export default API_ENDPOINTS
