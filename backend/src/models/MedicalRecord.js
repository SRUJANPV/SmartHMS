const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  recordType: {
    type: DataTypes.ENUM(
      'CONSULTATION',
      'PRESCRIPTION', 
      'LAB_RESULT',
      'DIAGNOSIS',
      'TREATMENT',
      'DOCUMENT',
      'OTHER'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medications: {
    type: DataTypes.JSON,
    allowNull: true
  },
  vitalSigns: {
    type: DataTypes.JSON,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  documentData: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  },
  documentType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  visitDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextAppointment: {
    type: DataTypes.DATE,
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
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'medical_records'
});

module.exports = MedicalRecord;