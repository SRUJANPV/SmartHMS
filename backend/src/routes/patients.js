const express = require('express');
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientStats,
  uploadPatientDocument
} = require('../controllers/patientController');
const {
  createPatientSchema,
  updatePatientSchema,
  documentUploadSchema
} = require('../validators/patientValidator');
const { auth, authorize, hasPermission } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Patient management routes
router.post(
  '/',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('manage_patients'),
  uploadSingle('profileImage'),
  createPatientSchema,
  createPatient
);

router.get(
  '/',
  hasPermission('view_patients'),
  getAllPatients
);

router.get(
  '/stats',
  authorize('Admin', 'Doctor', 'Staff'),
  getPatientStats
);

router.get(
  '/:id',
  hasPermission('view_patients'),
  getPatientById
);

router.put(
  '/:id',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('manage_patients'),
  uploadSingle('profileImage'),
  updatePatientSchema,
  updatePatient
);

router.delete(
  '/:id',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('manage_patients'),
  deletePatient
);

// Document upload route
router.post(
  '/:id/documents',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('manage_patients'),
  uploadSingle('document'),
  documentUploadSchema,
  uploadPatientDocument
);

module.exports = router;