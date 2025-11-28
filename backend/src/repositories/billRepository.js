const { Bill, BillItem, Patient } = require('../models');
const { Sequelize } = require('../models');
const { Op } = Sequelize;

class BillRepository {
  async createWithItems(billData) {
    const transaction = await Bill.sequelize.transaction();
    try {
      const bill = await Bill.create(billData, { transaction });
      if (billData.items && billData.items.length > 0) {
        const items = billData.items.map(item => ({ ...item, billId: bill.id }));
        await BillItem.bulkCreate(items, { transaction });
      }
      await transaction.commit();
      return bill;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(options = {}) {
    const { page = 1, limit = 10, search, status, patientId } = options;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (patientId) where.patientId = patientId;

    return await Bill.findAndCountAll({
      where,
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName', 'patientId'] },
        { model: BillItem, as: 'items' }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
  }

  async findByIdWithItems(billId) {
    return await Bill.findByPk(billId, {
      include: [{ model: BillItem, as: 'items' }]
    });
  }

  async findById(billId) {
    return await Bill.findByPk(billId);
  }

  async updateWithItems(billId, updateData) {
    const transaction = await Bill.sequelize.transaction();
    try {
      const bill = await Bill.findByPk(billId, { transaction });
      if (!bill) throw new Error('Bill not found');

      await bill.update(updateData, { transaction });

      if (updateData.items) {
        await BillItem.destroy({ where: { billId }, transaction });
        const items = updateData.items.map(item => ({ ...item, billId }));
        await BillItem.bulkCreate(items, { transaction });
      }

      await transaction.commit();
      return bill;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(billId, updateData) {
    const bill = await Bill.findByPk(billId);
    if (!bill) throw new Error('Bill not found');
    return await bill.update(updateData);
  }

  async delete(billId) {
    const bill = await Bill.findByPk(billId);
    if (!bill) throw new Error('Bill not found');
    return await bill.destroy();
  }

  async addItem(billId, itemData) {
    const bill = await Bill.findByPk(billId);
    if (!bill) throw new Error('Bill not found');

    const item = await BillItem.create({ ...itemData, billId });
    // Recalculate totals
    await this.updateBillTotals(billId);
    return item;
  }

  async removeItem(billId, itemId) {
    const item = await BillItem.findOne({ where: { id: itemId, billId } });
    if (!item) throw new Error('Item not found');

    await item.destroy();
    await this.updateBillTotals(billId);
    return item;
  }

  async updateBillTotals(billId) {
    const items = await BillItem.findAll({ where: { billId } });
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    await Bill.update({ subtotal, tax, total }, { where: { id: billId } });
  }

  async findByIdWithDetails(billId) {
    return await Bill.findByPk(billId, {
      include: [
        { model: Patient, as: 'patient' },
        { model: BillItem, as: 'items' }
      ]
    });
  }

  async getTotalRevenue(period = 'month') {
    const date = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(date.setDate(date.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(date.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    }

    const result = await Bill.sum('totalAmount', {
      where: {
        status: 'paid',
        createdAt: { [Op.gte]: startDate }
      }
    });

    return result || 0;
  }

  async countByStatus(status) {
    return await Bill.count({ where: { status } });
  }

  async getRevenueByMonth() {
    const result = await Bill.findAll({
      attributes: [
        [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
        [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'revenue']
      ],
      where: { status: 'paid' },
      group: ['year', 'month'],
      order: [['year', 'DESC'], ['month', 'DESC']],
      limit: 12
    });

    return result.map(item => ({
      month: `${item.dataValues.year}-${String(item.dataValues.month).padStart(2, '0')}`,
      revenue: parseFloat(item.dataValues.revenue)
    }));
  }
}

module.exports = new BillRepository();