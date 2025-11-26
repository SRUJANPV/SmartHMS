const { Appointment, User, Patient, Sequelize } = require('../models');
const { Op } = Sequelize;

class AppointmentService {
  async createAppointment(appointmentData, createdBy) {
    try {
      appointmentData.createdBy = createdBy;
      const appointment = await Appointment.create(appointmentData);
      return appointment;
    } catch (error) {
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
  }

  async getAllAppointments(options = {}) {
    try {
      const { page = 1, limit = 10, search, status, doctorId, patientId } = options;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;
      if (doctorId) where.doctorId = doctorId;
      if (patientId) where.patientId = patientId;

      const appointments = await Appointment.findAndCountAll({
        where,
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName', 'patientId'] },
          { model: User, as: 'doctor', attributes: ['id', 'firstName', 'lastName'] }
        ],
        limit,
        offset,
        order: [['appointmentDate', 'DESC'], ['appointmentTime', 'ASC']]
      });

      return {
        appointments: appointments.rows,
        total: appointments.count,
        page,
        totalPages: Math.ceil(appointments.count / limit)
      };
    } catch (error) {
      throw new Error(`Failed to fetch appointments: ${error.message}`);
    }
  }

  async getAppointmentById(id, user) {
    try {
      const appointment = await Appointment.findByPk(id, {
        include: [
          { model: Patient, as: 'patient' },
          { model: User, as: 'doctor', attributes: ['id', 'firstName', 'lastName'] }
        ]
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      return appointment;
    } catch (error) {
      throw new Error(`Failed to fetch appointment: ${error.message}`);
    }
  }

  async updateAppointment(id, updateData, updatedBy) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      updateData.updatedBy = updatedBy;
      await appointment.update(updateData);
      return appointment;
    } catch (error) {
      throw new Error(`Failed to update appointment: ${error.message}`);
    }
  }

  async updateAppointmentStatus(id, status, updatedBy) {
    try {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      await appointment.update({ status, updatedBy });
      return appointment;
    } catch (error) {
      throw new Error(`Failed to update appointment status: ${error.message}`);
    }
  }

  async getDoctorSchedule(doctorId, date) {
    try {
      const appointments = await Appointment.findAll({
        where: { doctorId, appointmentDate: date },
        include: [
          { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName', 'patientId'] }
        ],
        order: [['appointmentTime', 'ASC']]
      });

      return appointments;
    } catch (error) {
      throw new Error(`Failed to fetch doctor schedule: ${error.message}`);
    }
  }

  async getAvailableSlots(doctorId, date) {
    try {
      // This is a simplified version - in real app, you'd have working hours, breaks, etc.
      const workingHours = { start: '09:00', end: '17:00' };
      const slotDuration = 30; // minutes

      const bookedSlots = await Appointment.findAll({
        where: { doctorId, appointmentDate: date, status: { [Op.ne]: 'cancelled' } },
        attributes: ['appointmentTime']
      });

      const bookedTimes = bookedSlots.map(slot => slot.appointmentTime);

      const availableSlots = [];
      let currentTime = new Date(`1970-01-01T${workingHours.start}:00`);
      const endTime = new Date(`1970-01-01T${workingHours.end}:00`);

      while (currentTime < endTime) {
        const timeString = currentTime.toTimeString().slice(0, 5);
        if (!bookedTimes.includes(timeString)) {
          availableSlots.push(timeString);
        }
        currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
      }

      return availableSlots;
    } catch (error) {
      throw new Error(`Failed to fetch available slots: ${error.message}`);
    }
  }

  async getAppointmentStats(user) {
    try {
      const where = {};
      if (user.role !== 'Admin') {
        if (user.role === 'Doctor') {
          where.doctorId = user.id;
        }
      }

      const total = await Appointment.count({ where });
      const today = await Appointment.count({
        where: {
          ...where,
          appointmentDate: new Date().toISOString().split('T')[0]
        }
      });
      const upcoming = await Appointment.count({
        where: {
          ...where,
          appointmentDate: { [Op.gte]: new Date() },
          status: 'scheduled'
        }
      });

      return { total, today, upcoming };
    } catch (error) {
      throw new Error(`Failed to fetch appointment stats: ${error.message}`);
    }
  }
}

module.exports = new AppointmentService();