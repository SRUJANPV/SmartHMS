const express = require('express');
const {
  createInventoryItem,
  getAllInventory,
  getInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  updateStock,
  getLowStockItems,
  getInventoryStats,
  getExpiringItems
} = require('../controllers/InventoryController');
const {
  createInventorySchema,
  updateInventorySchema,
  updateStockSchema
} = require('../validators/inventoryValidator');
const { auth, authorize, hasPermission } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Inventory routes
router.post(
  '/',
  authorize('Admin', 'Staff'),
  hasPermission('manage_inventory'),
  createInventorySchema,
  createInventoryItem
);

router.get(
  '/',
  hasPermission('view_inventory'),
  getAllInventory
);

router.get(
  '/stats',
  authorize('Admin', 'Staff'),
  getInventoryStats
);

router.get(
  '/low-stock',
  authorize('Admin', 'Staff'),
  getLowStockItems
);

router.get(
  '/expiring',
  authorize('Admin', 'Staff'),
  getExpiringItems
);

router.get(
  '/:id',
  hasPermission('view_inventory'),
  getInventoryItem
);

router.put(
  '/:id',
  authorize('Admin', 'Staff'),
  hasPermission('manage_inventory'),
  updateInventorySchema,
  updateInventoryItem
);

router.delete(
  '/:id',
  authorize('Admin', 'Staff'),
  hasPermission('manage_inventory'),
  deleteInventoryItem
);

// Stock management
router.patch(
  '/:id/stock',
  authorize('Admin', 'Staff'),
  hasPermission('manage_inventory'),
  updateStockSchema,
  updateStock
);

module.exports = router;