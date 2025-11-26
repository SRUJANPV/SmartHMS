const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BillItem = sequelize.define('BillItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 1,
    allowNull: false
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  itemType: {
    type: DataTypes.ENUM('consultation', 'procedure', 'medication', 'test', 'room_charge', 'other'),
    defaultValue: 'other',
    allowNull: false
  },
  billId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Bills',
      key: 'id'
    }
  }
}, {
  tableName: 'bill_items'
});

module.exports = BillItem;