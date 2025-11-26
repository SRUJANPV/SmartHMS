const express = require('express');
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
  getDoctorSchedule,
  getAvailableSlots,
  getAppointmentStats
} = require('../controllers/appointmentController');
const { auth, authorize, hasPermission } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Appointment management routes
router.post(
  '/',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('manage_appointments'),
  createAppointment
);

router.get(
  '/',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('view_appointments'),
  getAllAppointments
);

router.get(
  '/stats',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('view_appointments'),
  getAppointmentStats
);

router.get(
  '/:id',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('view_appointments'),
  getAppointmentById
);

router.put(
  '/:id',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('manage_appointments'),
  updateAppointment
);

router.patch(
  '/:id/status',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('manage_appointments'),
  updateAppointmentStatus
);

// Doctor specific routes
router.get(
  '/doctor/:doctorId/schedule',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('view_appointments'),
  getDoctorSchedule
);

router.get(
  '/doctor/:doctorId/available-slots',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('view_appointments'),
  getAvailableSlots
);

module.exports = router;