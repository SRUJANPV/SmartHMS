const inventoryService = require('../services/inventoryService');
const { activityLog } = require('../utils/activityLog');
const logger = require('../utils/logger');

exports.createInventoryItem = async (req, res) => {
  try {
    const itemData = req.body;
    const item = await inventoryService.createInventoryItem(itemData, req.user.id);
    
    await activityLog(
      req.user.id,
      'INVENTORY_CREATE',
      `Created inventory item: ${item.name} (${item.itemCode})`,
      req
    );

    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: item
    });
  } catch (error) {
    logger.error('Create inventory item error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllInventory = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, lowStock, search } = req.query;
    const result = await inventoryService.getAllInventory({
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      lowStock: lowStock === 'true',
      search
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get inventory error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await inventoryService.getInventoryItem(id);

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    logger.error('Get inventory item error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const item = await inventoryService.updateInventoryItem(id, updateData, req.user.id);
    
    await activityLog(
      req.user.id,
      'INVENTORY_UPDATE',
      `Updated inventory item: ${item.name} (${item.itemCode})`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Inventory item updated successfully',
      data: item
    });
  } catch (error) {
    logger.error('Update inventory item error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    await inventoryService.deleteInventoryItem(id, req.user.id);
    
    await activityLog(
      req.user.id,
      'INVENTORY_DELETE',
      `Deleted inventory item with ID: ${id}`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    logger.error('Delete inventory item error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, type, reason } = req.body; // type: 'in' or 'out'

    const item = await inventoryService.updateStock(id, quantity, type, reason, req.user.id);
    
    await activityLog(
      req.user.id,
      'INVENTORY_STOCK_UPDATE',
      `Updated stock for ${item.name}: ${type} ${quantity} ${item.unitOfMeasure}`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: item
    });
  } catch (error) {
    logger.error('Update stock error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getLowStockItems = async (req, res) => {
  try {
    const items = await inventoryService.getLowStockItems();
    
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    logger.error('Get low stock items error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getInventoryStats = async (req, res) => {
  try {
    const stats = await inventoryService.getInventoryStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Get inventory stats error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getExpiringItems = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const items = await inventoryService.getExpiringItems(parseInt(days));
    
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    logger.error('Get expiring items error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};