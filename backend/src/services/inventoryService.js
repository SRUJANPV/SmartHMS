const { Inventory, Sequelize } = require('../models');
const { Op } = Sequelize;

class InventoryService {
  async createInventoryItem(itemData, createdBy) {
    try {
      itemData.createdBy = createdBy;
      const item = await Inventory.create(itemData);
      return item;
    } catch (error) {
      throw new Error(`Failed to create inventory item: ${error.message}`);
    }
  }

  async getAllInventory(options = {}) {
    try {
      const { page = 1, limit = 10, search, category, lowStock } = options;
      const offset = (page - 1) * limit;

      const where = {};
      if (search) {
        where.name = { [Op.iLike]: `%${search}%` };
      }
      if (category) where.category = category;
      if (lowStock) where.quantity = { [Op.lte]: Sequelize.col('minStockLevel') };

      const items = await Inventory.findAndCountAll({
        where,
        limit,
        offset,
        order: [['name', 'ASC']]
      });

      return {
        items: items.rows,
        total: items.count,
        page,
        totalPages: Math.ceil(items.count / limit)
      };
    } catch (error) {
      throw new Error(`Failed to fetch inventory: ${error.message}`);
    }
  }

  async getInventoryItem(id) {
    try {
      const item = await Inventory.findByPk(id);
      if (!item) {
        throw new Error('Inventory item not found');
      }
      return item;
    } catch (error) {
      throw new Error(`Failed to fetch inventory item: ${error.message}`);
    }
  }

  async updateInventoryItem(id, updateData, updatedBy) {
    try {
      const item = await Inventory.findByPk(id);
      if (!item) {
        throw new Error('Inventory item not found');
      }

      updateData.updatedBy = updatedBy;
      await item.update(updateData);
      return item;
    } catch (error) {
      throw new Error(`Failed to update inventory item: ${error.message}`);
    }
  }

  async deleteInventoryItem(id) {
    try {
      const item = await Inventory.findByPk(id);
      if (!item) {
        throw new Error('Inventory item not found');
      }

      await item.destroy();
      return item;
    } catch (error) {
      throw new Error(`Failed to delete inventory item: ${error.message}`);
    }
  }

  async updateStock(id, quantityChange, updatedBy) {
    try {
      const item = await Inventory.findByPk(id);
      if (!item) {
        throw new Error('Inventory item not found');
      }

      const newQuantity = item.quantity + quantityChange;
      if (newQuantity < 0) {
        throw new Error('Insufficient stock');
      }

      await item.update({ quantity: newQuantity, updatedBy });
      return item;
    } catch (error) {
      throw new Error(`Failed to update stock: ${error.message}`);
    }
  }

  async getLowStockItems() {
    try {
      const items = await Inventory.findAll({
        where: {
          quantity: { [Op.lte]: Sequelize.col('minStockLevel') }
        },
        order: [['quantity', 'ASC']]
      });

      return items;
    } catch (error) {
      throw new Error(`Failed to fetch low stock items: ${error.message}`);
    }
  }

  async getInventoryStats() {
    try {
      const totalItems = await Inventory.count();
      const lowStockItems = await Inventory.count({
        where: {
          quantity: { [require('../models').Sequelize.Op.lte]: require('../models').Sequelize.col('minStockLevel') }
        }
      });
      const totalValue = await Inventory.sum('unitPrice', {
        where: { quantity: { [Op.gt]: 0 } }
      });

      return {
        totalItems,
        lowStockItems,
        totalValue: totalValue || 0
      };
    } catch (error) {
      throw new Error(`Failed to fetch inventory stats: ${error.message}`);
    }
  }

  async getExpiringItems(days = 30) {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);

      const items = await Inventory.findAll({
        where: {
          expiryDate: {
            [Op.lte]: expiryDate,
            [Op.ne]: null
          }
        },
        order: [['expiryDate', 'ASC']]
      });

      return items;
    } catch (error) {
      throw new Error(`Failed to fetch expiring items: ${error.message}`);
    }
  }
}

module.exports = new InventoryService();