const { User, Role } = require('../models');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ 
      where: { email },
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name', 'permissions']
      }]
    });
  }

  async findByEmailWithRole(email) {
    return await User.findOne({ 
      where: { email },
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name', 'permissions']
      }]
    });
  }

  async findById(userId) {
    return await User.findByPk(userId);
  }

  async findByIdWithRole(userId) {
    return await User.findByPk(userId, {
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name', 'permissions']
      }],
      attributes: { exclude: ['password'] }
    });
  }

  async update(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.update(updateData);
  }

  async findAllByRole(roleName, options = {}) {
    const { page = 1, limit = 10, isActive = true } = options;
    const offset = (page - 1) * limit;

    return await User.findAndCountAll({
      where: { isActive },
      include: [{
        model: Role,
        as: 'role',
        where: { name: roleName },
        attributes: ['id', 'name', 'permissions']
      }],
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
  }

  async delete(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.destroy();
  }
}

module.exports = new UserRepository();