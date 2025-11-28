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

// GET /stats and /list/staff routes MUST come BEFORE /:id route to avoid matching issues
router.get(
  '/stats',
  authorize('Admin', 'Doctor', 'Staff'),
  getPatientStats
);

// Get all doctors and staff for dropdowns
router.get(
  '/list/staff',
  authorize('Admin', 'Doctor', 'Staff'),
  async (req, res) => {
    try {
      const { User, Role } = require('../models/index');
      const staff = await User.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        include: {
          model: Role,
          attributes: ['name'],
          as: 'role'
        },
        where: {
          isActive: true
        }
      });

      const doctors = staff.filter(s => s.role.name === 'Doctor');
      const allStaff = staff.filter(s => ['Doctor', 'Staff'].includes(s.role.name));

      res.json({
        doctors,
        staff: allStaff,
        all: staff
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch staff', error: error.message });
    }
  }
);

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