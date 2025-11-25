const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bill = sequelize.define('Bill', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  billNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  billDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'generated', 'sent', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'draft',
    allowNull: false
  },
  subTotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    allowNull: false
  },
  discountRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'insurance', 'online', 'bank_transfer'),
    allowNull: true
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Patients',
      key: 'id'
    }
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Appointments',
      key: 'id'
    }
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
  tableName: 'bills',
  indexes: [
    {
      fields: ['billNumber']
    },
    {
      fields: ['patientId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Bill;