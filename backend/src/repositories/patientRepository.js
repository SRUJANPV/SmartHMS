const { Patient, User, Sequelize } = require('../models');
const { Op } = Sequelize;

class PatientRepository {
  async create(patientData) {
    return await Patient.create(patientData);
  }

  async findAll(options = {}) {
    const { page = 1, limit = 10, search, status } = options;
    const offset = (page - 1) * limit;

    const whereClause = {
      isActive: status === 'inactive' ? false : true
    };

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { patientId: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Patient.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      attributes: { exclude: ['profileImage'] }, // Exclude large blob by default
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return {
      patients: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async findById(patientId) {
    return await Patient.findByPk(patientId, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });
  }

  async findByEmail(email) {
    return await Patient.findOne({ where: { email } });
  }

  async update(patientId, updateData) {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    return await patient.update(updateData);
  }

  async count(where = {}) {
    return await Patient.count({ where });
  }

  async countThisMonth() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return await Patient.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        }
      }
    });
  }

  async countByGender() {
    return await Patient.findAll({
      attributes: [
        'gender',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['gender'],
      where: { isActive: true }
    });
  }

  async countByBloodGroup() {
    return await Patient.findAll({
      attributes: [
        'bloodGroup',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['bloodGroup'],
      where: { 
        isActive: true,
        bloodGroup: {
          [Op.ne]: null
        }
      }
    });
  }
}

module.exports = new PatientRepository();