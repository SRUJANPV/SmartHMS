const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  appointmentTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 30, // minutes
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      'scheduled',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'no_show'
    ),
    defaultValue: 'scheduled',
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM(
      'consultation',
      'follow_up',
      'checkup',
      'emergency',
      'surgery',
      'other'
    ),
    defaultValue: 'consultation',
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'emergency'),
    defaultValue: 'medium'
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Patients',
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
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
  tableName: 'appointments',
  indexes: [
    {
      fields: ['appointmentDate', 'appointmentTime', 'doctorId']
    },
    {
      fields: ['patientId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Appointment;