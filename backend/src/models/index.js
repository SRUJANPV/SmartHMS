const { sequelize } = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Patient = require('./Patient');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');
const Bill = require('./Bill');
const BillItem = require('./BillItem');
const Inventory = require('./Inventory');
const Notification = require('./Notification');
const ActivityLog = require('./ActivityLog');
const RefreshToken = require('./RefreshToken');

// Define associations
const defineAssociations = () => {
  // User - Role
  User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
  Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

  // Patient - User (created by)
  Patient.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
  User.hasMany(Patient, { foreignKey: 'createdBy', as: 'createdPatients' });

  // Patient - Medical Records
  Patient.hasMany(MedicalRecord, { foreignKey: 'patientId', as: 'medicalRecords' });
  MedicalRecord.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

  // Appointment associations
  Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
  Appointment.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });
  Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
  User.hasMany(Appointment, { foreignKey: 'doctorId', as: 'doctorAppointments' });

  // Bill associations
  Bill.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
  Bill.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
  Bill.hasMany(BillItem, { foreignKey: 'billId', as: 'items' });
  BillItem.belongsTo(Bill, { foreignKey: 'billId', as: 'bill' });

  // Inventory - User (created by)
  Inventory.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
  User.hasMany(Inventory, { foreignKey: 'createdBy', as: 'createdInventory' });

  // Notifications
  Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

  // Activity Logs
  ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activityLogs' });

  // Refresh Tokens
  RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
};

module.exports = {
  sequelize,
  User,
  Role,
  Patient,
  Appointment,
  MedicalRecord,
  Bill,
  BillItem,
  Inventory,
  Notification,
  ActivityLog,
  RefreshToken,
  defineAssociations
};