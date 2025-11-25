const { MedicalRecord, User } = require('../models');

class MedicalRecordRepository {
  async create(recordData) {
    return await MedicalRecord.create(recordData);
  }

  async findByPatientId(patientId) {
    return await MedicalRecord.findAll({
      where: { patientId },
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'firstName', 'lastName']
      }],
      order: [['createdAt', 'DESC']]
    });
  }

  async findById(recordId) {
    return await MedicalRecord.findByPk(recordId, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });
  }

  async update(recordId, updateData) {
    const record = await MedicalRecord.findByPk(recordId);
    if (!record) {
      throw new Error('Medical record not found');
    }
    return await record.update(updateData);
  }

  async delete(recordId) {
    const record = await MedicalRecord.findByPk(recordId);
    if (!record) {
      throw new Error('Medical record not found');
    }
    return await record.destroy();
  }
}

module.exports = new MedicalRecordRepository();