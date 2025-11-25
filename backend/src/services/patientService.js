const patientRepository = require('../repositories/patientRepository');
const medicalRecordRepository = require('../repositories/medicalRecordRepository');
const { generatePatientId } = require('../utils/helpers');

class PatientService {
  async createPatient(patientData, createdBy) {
    try {
      // Generate unique patient ID
      patientData.patientId = generatePatientId();
      patientData.createdBy = createdBy;

      // Check if patient with email already exists
      if (patientData.email) {
        const existingPatient = await patientRepository.findByEmail(patientData.email);
        if (existingPatient) {
          throw new Error('Patient with this email already exists');
        }
      }

      const patient = await patientRepository.create(patientData);
      return patient;
    } catch (error) {
      throw new Error(`Failed to create patient: ${error.message}`);
    }
  }

  async getAllPatients(options = {}) {
    try {
      const { page, limit, search, status } = options;
      
      const patients = await patientRepository.findAll({
        page,
        limit,
        search,
        status
      });

      return patients;
    } catch (error) {
      throw new Error(`Failed to fetch patients: ${error.message}`);
    }
  }

  async getPatientById(patientId) {
    try {
      const patient = await patientRepository.findById(patientId);
      
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Get medical records for this patient
      const medicalRecords = await medicalRecordRepository.findByPatientId(patientId);
      
      return {
        ...patient.toJSON(),
        medicalRecords
      };
    } catch (error) {
      throw new Error(`Failed to fetch patient: ${error.message}`);
    }
  }

  async updatePatient(patientId, updateData, updatedBy) {
    try {
      const patient = await patientRepository.findById(patientId);
      
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Prevent updating patientId
      if (updateData.patientId) {
        delete updateData.patientId;
      }

      const updatedPatient = await patientRepository.update(patientId, updateData);
      return updatedPatient;
    } catch (error) {
      throw new Error(`Failed to update patient: ${error.message}`);
    }
  }

  async deletePatient(patientId, deletedBy) {
    try {
      const patient = await patientRepository.findById(patientId);
      
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Soft delete by setting isActive to false
      await patientRepository.update(patientId, { isActive: false });
      
      return true;
    } catch (error) {
      throw new Error(`Failed to delete patient: ${error.message}`);
    }
  }

  async getPatientStats() {
    try {
      const totalPatients = await patientRepository.count();
      const activePatients = await patientRepository.count({ isActive: true });
      const newPatientsThisMonth = await patientRepository.countThisMonth();
      
      const statsByGender = await patientRepository.countByGender();
      const statsByBloodGroup = await patientRepository.countByBloodGroup();

      return {
        total: totalPatients,
        active: activePatients,
        newThisMonth: newPatientsThisMonth,
        byGender: statsByGender,
        byBloodGroup: statsByBloodGroup
      };
    } catch (error) {
      throw new Error(`Failed to fetch patient stats: ${error.message}`);
    }
  }

  async uploadPatientDocument(patientId, documentData, uploadedBy) {
    try {
      const patient = await patientRepository.findById(patientId);
      
      if (!patient) {
        throw new Error('Patient not found');
      }

      const medicalRecord = await medicalRecordRepository.create({
        patientId,
        recordType: 'DOCUMENT',
        title: documentData.fileName,
        description: documentData.description,
        documentData: documentData.fileBuffer,
        documentType: documentData.documentType,
        fileType: documentData.fileType,
        createdBy: uploadedBy
      });

      return medicalRecord;
    } catch (error) {
      throw new Error(`Failed to upload document: ${error.message}`);
    }
  }
}

module.exports = new PatientService();