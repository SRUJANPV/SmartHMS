'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get admin role ID
    const [roles] = await queryInterface.sequelize.query(
      'SELECT id FROM roles WHERE name = "Admin" LIMIT 1'
    );
    
    if (roles.length > 0) {
      const adminRoleId = roles[0].id;
      const hashedPassword = await bcrypt.hash('admin123', 12);

      await queryInterface.bulkInsert('users', [{
        id: require('uuid').v4(),
        email: 'admin@smartcare.com',
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Administrator',
        phone: '+1234567890',
        specialization: 'System Administration',
        isActive: true,
        roleId: adminRoleId,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@smartcare.com' }, {});
  }
};