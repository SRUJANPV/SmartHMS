'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [
      {
        name: 'Admin',
        description: 'System Administrator with full access',
        permissions: ['all'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Doctor',
        description: 'Medical Doctor',
        permissions: [
          'view_patients', 'manage_patients', 'view_appointments', 'manage_appointments',
          'view_medical_records', 'manage_medical_records', 'view_bills'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Nurse',
        description: 'Nursing Staff',
        permissions: [
          'view_patients', 'view_appointments', 'manage_appointments',
          'view_medical_records', 'manage_medical_records'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Staff',
        description: 'Hospital Staff',
        permissions: [
          'view_patients', 'manage_patients', 'view_appointments', 'manage_appointments',
          'view_bills', 'manage_bills', 'view_inventory'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Patient',
        description: 'Patient',
        permissions: [
          'view_own_profile', 'view_own_appointments', 'view_own_bills'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('roles', roles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};