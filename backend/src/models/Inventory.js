const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  itemCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM(
      'medication',
      'medical_supplies',
      'equipment',
      'laboratory',
      'surgical',
      'office_supplies',
      'other'
    ),
    defaultValue: 'other',
    allowNull: false
  },
  currentStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  minimumStock: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    allowNull: false
  },
  maximumStock: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    allowNull: false
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false
  },
  unitOfMeasure: {
    type: DataTypes.STRING,
    defaultValue: 'pcs',
    allowNull: false
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: true
  },
  supplierContact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  batchNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'inventory',
  indexes: [
    {
      fields: ['itemCode']
    },
    {
      fields: ['category']
    },
    {
      fields: ['currentStock']
    }
  ]
});

module.exports = Inventory;