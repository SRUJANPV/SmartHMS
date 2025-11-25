const express = require('express');
const {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
  addBillItem,
  removeBillItem,
  updateBillStatus,
  generateInvoicePdf,
  getBillingStats
} = require('../controllers/billingController');
const {
  createBillSchema,
  updateBillSchema,
  billItemSchema,
  billStatusSchema
} = require('../validators/billingValidator');
const { auth, authorize, hasPermission } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Billing routes
router.post(
  '/',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('manage_bills'),
  createBillSchema,
  createBill
);

router.get(
  '/',
  hasPermission('view_bills'),
  getAllBills
);

router.get(
  '/stats',
  authorize('Admin', 'Doctor', 'Staff'),
  getBillingStats
);

router.get(
  '/:id',
  hasPermission('view_bills'),
  getBillById
);

router.put(
  '/:id',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('manage_bills'),
  updateBillSchema,
  updateBill
);

router.delete(
  '/:id',
  authorize('Admin', 'Staff'),
  hasPermission('manage_bills'),
  deleteBill
);

// Bill items
router.post(
  '/:id/items',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('manage_bills'),
  billItemSchema,
  addBillItem
);

router.delete(
  '/:id/items/:itemId',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('manage_bills'),
  removeBillItem
);

// Bill status and PDF
router.patch(
  '/:id/status',
  authorize('Admin', 'Doctor', 'Staff'),
  hasPermission('manage_bills'),
  billStatusSchema,
  updateBillStatus
);

router.get(
  '/:id/invoice',
  hasPermission('view_bills'),
  generateInvoicePdf
);

module.exports = router;