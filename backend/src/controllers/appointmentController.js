const appointmentService = require('../services/appointmentService');
const { activityLog } = require('../utils/activityLog');
const logger = require('../utils/logger');

exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    const appointment = await appointmentService.createAppointment(appointmentData, req.user.id);
    
    await activityLog(
      req.user.id,
      'APPOINTMENT_CREATE',
      `Created appointment for patient ${appointmentData.patientId} with doctor ${appointmentData.doctorId}`,
      req
    );

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    logger.error('Create appointment error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, doctorId, patientId, date } = req.query;
    const result = await appointmentService.getAllAppointments({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      doctorId,
      patientId,
      date,
      user: req.user
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get appointments error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentById(id, req.user);

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    logger.error('Get appointment error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const appointment = await appointmentService.updateAppointment(id, updateData, req.user.id);
    
    await activityLog(
      req.user.id,
      'APPOINTMENT_UPDATE',
      `Updated appointment: ${id}`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    logger.error('Update appointment error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await appointmentService.updateAppointmentStatus(id, status, req.user.id);
    
    await activityLog(
      req.user.id,
      'APPOINTMENT_STATUS_UPDATE',
      `Updated appointment ${id} status to ${status}`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    logger.error('Update appointment status error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    const schedule = await appointmentService.getDoctorSchedule(doctorId, date);

    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    logger.error('Get doctor schedule error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    const slots = await appointmentService.getAvailableSlots(doctorId, date);

    res.status(200).json({
      success: true,
      data: slots
    });
  } catch (error) {
    logger.error('Get available slots error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAppointmentStats = async (req, res) => {
  try {
    const stats = await appointmentService.getAppointmentStats(req.user);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Get appointment stats error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};