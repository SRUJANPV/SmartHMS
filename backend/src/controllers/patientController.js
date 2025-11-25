const patientService = require('../services/patientService');
const { activityLog } = require('../utils/activityLog');
const logger = require('../utils/logger');

exports.createPatient = async (req, res) => {
  try {
    const patientData = req.body;
    
    // Handle file upload if present
    if (req.file) {
      patientData.profileImage = req.file.buffer;
    }

    const patient = await patientService.createPatient(patientData, req.user.id);
    
    await activityLog(
      req.user.id,
      'PATIENT_CREATE',
      `Created patient: ${patient.firstName} ${patient.lastName} (${patient.patientId})`,
      req
    );

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    });
  } catch (error) {
    logger.error('Create patient error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const result = await patientService.getAllPatients({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      status
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get patients error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await patientService.getPatientById(id);

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    logger.error('Get patient error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.profileImage = req.file.buffer;
    }

    const patient = await patientService.updatePatient(id, updateData, req.user.id);
    
    await activityLog(
      req.user.id,
      'PATIENT_UPDATE',
      `Updated patient: ${patient.firstName} ${patient.lastName} (${patient.patientId})`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    logger.error('Update patient error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await patientService.deletePatient(id, req.user.id);
    
    await activityLog(
      req.user.id,
      'PATIENT_DELETE',
      `Deleted patient with ID: ${id}`,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    logger.error('Delete patient error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPatientStats = async (req, res) => {
  try {
    const stats = await patientService.getPatientStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Get patient stats error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.uploadPatientDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const document = await patientService.uploadPatientDocument(
      id, 
      {
        fileBuffer: req.file.buffer,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        documentType,
        description
      },
      req.user.id
    );

    await activityLog(
      req.user.id,
      'PATIENT_DOCUMENT_UPLOAD',
      `Uploaded document for patient ID: ${id}`,
      req
    );

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    });
  } catch (error) {
    logger.error('Upload document error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};