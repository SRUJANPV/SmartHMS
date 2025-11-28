/**
 * SmartHMS Database Seeder
 * This script inserts test data into the database with proper bcrypt password hashing
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/database');
const { User, Role, Patient, Appointment, Bill, BillItem, Inventory, MedicalRecord } = require('./src/models');

// UUID helper
const generateUUID = () => require('crypto').randomUUID();

// Hash password function
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Mangalore-based names
const DOCTORS = [
  { firstName: 'Srujan', lastName: 'Prabhu', email: 'srujan@hospital.com', specialization: 'Cardiology', licenseNumber: 'LIC001', dateOfBirth: '1985-03-15', phone: '9876543210', address: 'Hampankatta, Mangalore' },
  { firstName: 'Sujan', lastName: 'Kumar', email: 'sujan@hospital.com', specialization: 'Orthopedics', licenseNumber: 'LIC002', dateOfBirth: '1988-06-20', phone: '9876543211', address: 'Balmatta, Mangalore' },
  { firstName: 'Jayadhithya', lastName: 'Sharma', email: 'jayadhithya@hospital.com', specialization: 'Neurology', licenseNumber: 'LIC003', dateOfBirth: '1986-08-10', phone: '9876543212', address: 'Lighthouse Hill, Mangalore' },
  { firstName: 'Shreyas', lastName: 'Patel', email: 'shreyas@hospital.com', specialization: 'Pediatrics', licenseNumber: 'LIC004', dateOfBirth: '1990-02-25', phone: '9876543213', address: 'Urwa, Mangalore' },
  { firstName: 'Vijeth', lastName: 'Reddy', email: 'vijeth@hospital.com', specialization: 'Dermatology', licenseNumber: 'LIC005', dateOfBirth: '1987-11-30', phone: '9876543214', address: 'Panambur, Mangalore' },
  { firstName: 'Harshan', lastName: 'Nayak', email: 'harshan@hospital.com', specialization: 'Psychiatry', licenseNumber: 'LIC006', dateOfBirth: '1989-05-12', phone: '9876543215', address: 'Mangaladevi, Mangalore' },
  { firstName: 'Sujith', lastName: 'Rao', email: 'sujith@hospital.com', specialization: 'General Surgery', licenseNumber: 'LIC007', dateOfBirth: '1984-09-18', phone: '9876543216', address: 'Attavar, Mangalore' },
  { firstName: 'Sujeeth', lastName: 'Kumar', email: 'sujeeth@hospital.com', specialization: 'ENT', licenseNumber: 'LIC008', dateOfBirth: '1991-01-22', phone: '9876543217', address: 'Bilalpet, Mangalore' }
];

const STAFF = [
  { firstName: 'Srujan', lastName: 'Nurse', email: 'srujan.staff@hospital.com', dateOfBirth: '1992-04-14', phone: '9876543218', address: 'Konala, Mangalore' },
  { firstName: 'Sujan', lastName: 'Technician', email: 'sujan.staff@hospital.com', dateOfBirth: '1995-07-08', phone: '9876543219', address: 'Kadri, Mangalore' },
  { firstName: 'Jayadhithya', lastName: 'Assistant', email: 'jayadhithya.staff@hospital.com', dateOfBirth: '1993-12-03', phone: '9876543220', address: 'Deralakatte, Mangalore' },
  { firstName: 'Shreyas', lastName: 'Receptionist', email: 'shreyas.staff@hospital.com', dateOfBirth: '1994-10-19', phone: '9876543221', address: 'Falnir, Mangalore' }
];

const PATIENTS = [
  { firstName: 'Rajesh', lastName: 'Bhat', email: 'rajesh.bhat@email.com', phone: '8765432100', dateOfBirth: '1975-05-20', gender: 'Male', address: 'Urwa, Mangalore', bloodGroup: 'O+', medicalHistory: 'Hypertension, Diabetes' },
  { firstName: 'Priya', lastName: 'Desai', email: 'priya.desai@email.com', phone: '8765432101', dateOfBirth: '1988-09-12', gender: 'Female', address: 'Jeppu, Mangalore', bloodGroup: 'A+', medicalHistory: 'Thyroid issues' },
  { firstName: 'Arun', lastName: 'Prabhu', email: 'arun.prabhu@email.com', phone: '8765432102', dateOfBirth: '1965-03-07', gender: 'Male', address: 'Hampankatta, Mangalore', bloodGroup: 'B+', medicalHistory: 'Previous cardiac history' },
  { firstName: 'Anjali', lastName: 'Nayak', email: 'anjali.nayak@email.com', phone: '8765432103', dateOfBirth: '1992-11-28', gender: 'Female', address: 'Lighthouse Hill, Mangalore', bloodGroup: 'AB-', medicalHistory: 'Migraine' },
  { firstName: 'Vikram', lastName: 'Rao', email: 'vikram.rao@email.com', phone: '8765432104', dateOfBirth: '1978-06-15', gender: 'Male', address: 'Panambur, Mangalore', bloodGroup: 'O-', medicalHistory: 'Arthritis' },
  { firstName: 'Divya', lastName: 'Shetty', email: 'divya.shetty@email.com', phone: '8765432105', dateOfBirth: '1995-01-10', gender: 'Female', address: 'Balmatta, Mangalore', bloodGroup: 'B-', medicalHistory: 'No major health issues' },
  { firstName: 'Karthik', lastName: 'Adiga', email: 'karthik.adiga@email.com', phone: '8765432106', dateOfBirth: '1980-08-22', gender: 'Male', address: 'Attavar, Mangalore', bloodGroup: 'A-', medicalHistory: 'Asthma' },
  { firstName: 'Meera', lastName: 'Kamath', email: 'meera.kamath@email.com', phone: '8765432107', dateOfBirth: '1987-12-05', gender: 'Female', address: 'Mangaladevi, Mangalore', bloodGroup: 'AB+', medicalHistory: 'Diabetes' },
  { firstName: 'Amit', lastName: 'Poojary', email: 'amit.poojary@email.com', phone: '8765432108', dateOfBirth: '1970-02-14', gender: 'Male', address: 'Deralakatte, Mangalore', bloodGroup: 'O+', medicalHistory: 'Heart disease' },
  { firstName: 'Sneha', lastName: 'Hegde', email: 'sneha.hegde@email.com', phone: '8765432109', dateOfBirth: '1998-07-30', gender: 'Female', address: 'Kadri, Mangalore', bloodGroup: 'O+', medicalHistory: 'No known allergies' }
];

const INVENTORY = [
  { itemCode: 'MED001', name: 'Aspirin', description: 'Painkiller - 100mg tablets', category: 'medication', currentStock: 500, minimumStock: 50, maximumStock: 1000, unitPrice: 5.00, unitOfMeasure: 'tablets', supplier: 'Cipla Ltd', expiryDate: '2027-12-31' },
  { itemCode: 'MED002', name: 'Amoxicillin', description: 'Antibiotic - 500mg capsules', category: 'medication', currentStock: 300, minimumStock: 50, maximumStock: 800, unitPrice: 12.00, unitOfMeasure: 'capsules', supplier: 'Dr. Reddy\'s', expiryDate: '2027-06-30' },
  { itemCode: 'MED003', name: 'Metformin', description: 'Diabetes medication - 500mg tablets', category: 'medication', currentStock: 400, minimumStock: 50, maximumStock: 900, unitPrice: 8.00, unitOfMeasure: 'tablets', supplier: 'Lupin Ltd', expiryDate: '2027-09-30' },
  { itemCode: 'MED004', name: 'Lisinopril', description: 'Blood pressure medication - 10mg tablets', category: 'medication', currentStock: 250, minimumStock: 50, maximumStock: 600, unitPrice: 15.00, unitOfMeasure: 'tablets', supplier: 'Torrent Pharma', expiryDate: '2027-03-31' },
  { itemCode: 'MED005', name: 'Vitamin C', description: 'Vitamin supplement - 250mg tablets', category: 'medication', currentStock: 1000, minimumStock: 100, maximumStock: 2000, unitPrice: 3.00, unitOfMeasure: 'tablets', supplier: 'Himalaya', expiryDate: '2028-12-31' },
  { itemCode: 'SUP001', name: 'Syringes', description: '10ml Medical syringes', category: 'medical_supplies', currentStock: 5000, minimumStock: 500, maximumStock: 10000, unitPrice: 2.50, unitOfMeasure: 'pcs', supplier: 'Becton Dickinson', expiryDate: '2026-12-31' },
  { itemCode: 'SUP002', name: 'Surgical Gloves', description: 'Latex free gloves - box of 100', category: 'medical_supplies', currentStock: 200, minimumStock: 50, maximumStock: 500, unitPrice: 150.00, unitOfMeasure: 'boxes', supplier: 'Ansell Healthcare', expiryDate: '2026-06-30' },
  { itemCode: 'SUP003', name: 'Bandages', description: 'Sterile bandages - 5cm x 5cm', category: 'medical_supplies', currentStock: 2000, minimumStock: 200, maximumStock: 5000, unitPrice: 1.50, unitOfMeasure: 'pcs', supplier: 'Johnson & Johnson', expiryDate: '2026-12-31' },
  { itemCode: 'EQP001', name: 'Blood Pressure Monitor', description: 'Digital BP monitor - automatic', category: 'equipment', currentStock: 10, minimumStock: 5, maximumStock: 20, unitPrice: 2500.00, unitOfMeasure: 'pcs', supplier: 'Omron', expiryDate: '2029-12-31' },
  { itemCode: 'EQP002', name: 'Thermometer', description: 'Digital thermometer', category: 'equipment', currentStock: 25, minimumStock: 10, maximumStock: 50, unitPrice: 500.00, unitOfMeasure: 'pcs', supplier: 'Microlife', expiryDate: '2029-12-31' },
  { itemCode: 'LAB001', name: 'Blood Culture Bottle', description: 'Sterile culture bottle', category: 'laboratory', currentStock: 500, minimumStock: 100, maximumStock: 1000, unitPrice: 50.00, unitOfMeasure: 'pcs', supplier: 'EDDA Technology', expiryDate: '2026-12-31' },
  { itemCode: 'LAB002', name: 'Microscope Slides', description: 'Glass slides for microscopy', category: 'laboratory', currentStock: 1000, minimumStock: 200, maximumStock: 2000, unitPrice: 10.00, unitOfMeasure: 'pcs', supplier: 'Fisher Scientific', expiryDate: '2028-12-31' },
  { itemCode: 'SUR001', name: 'Surgical Scissors', description: 'Stainless steel surgical scissors', category: 'surgical', currentStock: 30, minimumStock: 5, maximumStock: 50, unitPrice: 500.00, unitOfMeasure: 'pcs', supplier: 'Karl Storz', expiryDate: '2030-12-31' },
  { itemCode: 'SUR002', name: 'Scalpel Blades', description: 'Surgical scalpel blades - box of 100', category: 'surgical', currentStock: 50, minimumStock: 10, maximumStock: 100, unitPrice: 300.00, unitOfMeasure: 'boxes', supplier: 'Swann-Morton', expiryDate: '2026-12-31' },
  { itemCode: 'OFF001', name: 'Paper A4', description: 'Printer paper - 500 sheets', category: 'office_supplies', currentStock: 100, minimumStock: 20, maximumStock: 300, unitPrice: 150.00, unitOfMeasure: 'reams', supplier: 'ITC Ltd', expiryDate: '2026-12-31' }
];

async function seedDatabase() {
  try {
    console.log('🔄 Starting database seeding...');
    
    // Authenticate and sync
    await sequelize.authenticate();
    console.log('✅ Database connection authenticated');
    
    // Find Admin and Doctor roles
    const adminRole = await Role.findOne({ where: { name: 'Admin' } });
    const doctorRole = await Role.findOne({ where: { name: 'Doctor' } });
    const staffRole = await Role.findOne({ where: { name: 'Staff' } });

    if (!adminRole || !doctorRole || !staffRole) {
      throw new Error('❌ Roles not found. Please ensure roles are seeded first.');
    }

    // ===== 1. CREATE ADMIN USER =====
    console.log('\n📝 Checking admin user...');
    let adminUser = await User.findOne({ where: { email: 'admin@hospital.com' } });
    if (!adminUser) {
      const adminPassword = await hashPassword('admin@hospital.com');
      adminUser = await User.create({
        id: generateUUID(),
        email: 'admin@hospital.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '9876543200',
        specialization: 'Administration',
        licenseNumber: 'ADM001',
        dateOfBirth: '1980-01-01',
        address: 'Hospital Administrative Office, Mangalore',
        isActive: true,
        roleId: adminRole.id
      });
      console.log(`✅ Admin user created: ${adminUser.email}`);
    } else {
      console.log(`✅ Admin user already exists: ${adminUser.email}`);
    }

    // ===== 2. CREATE DOCTORS =====
    console.log('\n👨‍⚕️ Creating/Checking doctors...');
    const doctorIds = [];
    for (const doctorData of DOCTORS) {
      let doctor = await User.findOne({ where: { email: doctorData.email } });
      if (!doctor) {
        const password = await hashPassword(doctorData.email);
        doctor = await User.create({
          id: generateUUID(),
          email: doctorData.email,
          password,
          firstName: doctorData.firstName,
          lastName: doctorData.lastName,
          phone: doctorData.phone,
          specialization: doctorData.specialization,
          licenseNumber: doctorData.licenseNumber,
          dateOfBirth: doctorData.dateOfBirth,
          address: doctorData.address,
          isActive: true,
          roleId: doctorRole.id
        });
        console.log(`  ✅ ${doctor.firstName} ${doctor.lastName} (created)`);
      } else {
        console.log(`  ✅ ${doctor.firstName} ${doctor.lastName} (exists)`);
      }
      doctorIds.push(doctor.id);
    }

    // ===== 3. CREATE STAFF =====
    console.log('\n👩‍⚕️ Creating/Checking staff members...');
    const staffIds = [];
    for (const staffData of STAFF) {
      let staff = await User.findOne({ where: { email: staffData.email } });
      if (!staff) {
        const password = await hashPassword(staffData.email);
        staff = await User.create({
          id: generateUUID(),
          email: staffData.email,
          password,
          firstName: staffData.firstName,
          lastName: staffData.lastName,
          phone: staffData.phone,
          dateOfBirth: staffData.dateOfBirth,
          address: staffData.address,
          isActive: true,
          roleId: staffRole.id
        });
        console.log(`  ✅ ${staff.firstName} ${staff.lastName} (created)`);
      } else {
        console.log(`  ✅ ${staff.firstName} ${staff.lastName} (exists)`);
      }
      staffIds.push(staff.id);
    }

    // ===== 4. CREATE PATIENTS =====
    console.log('\n🏥 Creating/Checking patients...');
    const patientIds = [];
    for (let i = 0; i < PATIENTS.length; i++) {
      const patientData = PATIENTS[i];
      const patientId = `PAT${String(i + 1).padStart(3, '0')}`;
      let patient = await Patient.findOne({ where: { patientId } });
      
      if (!patient) {
        patient = await Patient.create({
          id: generateUUID(),
          patientId,
          firstName: patientData.firstName,
          lastName: patientData.lastName,
          email: patientData.email,
          phone: patientData.phone,
          dateOfBirth: patientData.dateOfBirth,
          gender: patientData.gender,
          address: patientData.address,
          bloodGroup: patientData.bloodGroup,
          allergies: [],
          medicalHistory: patientData.medicalHistory,
          isActive: true,
          createdBy: adminUser.id
        });
        console.log(`  ✅ ${patient.firstName} ${patient.lastName} (created)`);
      } else {
        console.log(`  ✅ ${patient.firstName} ${patient.lastName} (exists)`);
      }
      patientIds.push(patient.id);
    }

    // ===== 5. CREATE APPOINTMENTS =====
    console.log('\n📅 Creating appointments...');
    const appointmentTypes = ['consultation', 'follow_up', 'checkup', 'emergency', 'surgery', 'other'];
    const statuses = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];
    const priorities = ['low', 'medium', 'high', 'emergency'];
    
    const appointmentCount = await Appointment.count();
    if (appointmentCount === 0) {
      for (let i = 0; i < 10; i++) {
        await Appointment.create({
          id: generateUUID(),
          patientId: patientIds[i % patientIds.length],
          doctorId: doctorIds[i % doctorIds.length],
          appointmentDate: new Date(2025, 11, i + 1),
          appointmentTime: `${9 + (i % 8)}:${(i * 15) % 60}:00`,
          duration: 30 + (i % 3) * 15,
          status: statuses[i % statuses.length],
          type: appointmentTypes[i % appointmentTypes.length],
          reason: `Appointment ${i + 1}`,
          notes: `Follow-up notes for appointment ${i + 1}`,
          symptoms: 'General symptoms',
          priority: priorities[i % priorities.length],
          createdBy: adminUser.id
        });
      }
      console.log(`  ✅ 10 appointments created`);
    } else {
      console.log(`  ✅ ${appointmentCount} appointments already exist`);
    }

    // ===== 6. CREATE BILLS =====
    console.log('\n💰 Creating bills...');
    const billStatuses = ['draft', 'generated', 'sent', 'paid', 'overdue', 'cancelled'];
    const paymentMethods = ['cash', 'card', 'insurance', 'online', 'bank_transfer'];
    
    const billCount = await Bill.count();
    const billIds = [];
    
    if (billCount === 0) {
      for (let i = 0; i < 10; i++) {
        const subTotal = 2000 + (i * 500);
        const taxRate = 18;
        const discountRate = 10;
        const taxAmount = subTotal * (taxRate / 100);
        const discountAmount = subTotal * (discountRate / 100);
        const totalAmount = subTotal + taxAmount - discountAmount;

        const bill = await Bill.create({
          id: generateUUID(),
          billNumber: `BILL-2025-${String(i + 1).padStart(3, '0')}`,
          billDate: new Date(2025, 10, 20 + i),
          dueDate: new Date(2025, 11, 5 + i),
          status: billStatuses[i % billStatuses.length],
          subTotal,
          taxAmount: Math.round(taxAmount * 100) / 100,
          discountAmount: Math.round(discountAmount * 100) / 100,
          totalAmount: Math.round(totalAmount * 100) / 100,
          taxRate,
          discountRate,
          paymentMethod: paymentMethods[i % paymentMethods.length],
          patientId: patientIds[i % patientIds.length],
          createdBy: adminUser.id
        });
        billIds.push(bill.id);
      }
      console.log(`  ✅ 10 bills created`);
    } else {
      console.log(`  ✅ ${billCount} bills already exist`);
      const bills = await Bill.findAll();
      bills.forEach(b => billIds.push(b.id));
    }

    // ===== 7. CREATE BILL ITEMS =====
    console.log('\n📋 Creating bill items...');
    const billItemCount = await BillItem.count();
    if (billItemCount === 0) {
      const billItemTypes = ['consultation', 'procedure', 'medication', 'test', 'room_charge', 'other'];
      for (let i = 0; i < billIds.length; i++) {
        for (let j = 0; j < 2; j++) {
          const itemPrice = 1000 + (j * 500);
          await BillItem.create({
            id: generateUUID(),
            description: `Service Item ${j + 1}`,
            quantity: 1,
            unitPrice: itemPrice,
            total: itemPrice,
            itemType: billItemTypes[j % billItemTypes.length],
            billId: billIds[i]
          });
        }
      }
      console.log(`  ✅ Bill items created`);
    } else {
      console.log(`  ✅ ${billItemCount} bill items already exist`);
    }

    // ===== 8. CREATE INVENTORY =====
    console.log('\n📦 Creating inventory items...');
    const inventoryCount = await Inventory.count();
    if (inventoryCount === 0) {
      for (const inventoryData of INVENTORY) {
        await Inventory.create({
          id: generateUUID(),
          itemCode: inventoryData.itemCode,
          name: inventoryData.name,
          description: inventoryData.description,
          category: inventoryData.category,
          currentStock: inventoryData.currentStock,
          minimumStock: inventoryData.minimumStock,
          maximumStock: inventoryData.maximumStock,
          unitPrice: inventoryData.unitPrice,
          unitOfMeasure: inventoryData.unitOfMeasure,
          supplier: inventoryData.supplier,
          expiryDate: inventoryData.expiryDate,
          isActive: true,
          createdBy: adminUser.id
        });
      }
      console.log(`  ✅ ${INVENTORY.length} inventory items created`);
    } else {
      console.log(`  ✅ ${inventoryCount} inventory items already exist`);
    }

    // ===== 9. CREATE MEDICAL RECORDS =====
    console.log('\n📄 Creating medical records...');
    const medicalRecordCount = await MedicalRecord.count();
    if (medicalRecordCount === 0) {
      const recordTypes = ['CONSULTATION', 'PRESCRIPTION', 'LAB_RESULT', 'DIAGNOSIS', 'TREATMENT', 'DOCUMENT', 'OTHER'];
      for (let i = 0; i < patientIds.length; i++) {
        await MedicalRecord.create({
          id: generateUUID(),
          recordType: recordTypes[i % recordTypes.length],
          title: `Medical Record ${i + 1}`,
          description: `Description for medical record ${i + 1}`,
          diagnosis: 'Initial diagnosis',
          treatment: 'Treatment prescribed',
          notes: 'Follow-up notes',
          visitDate: new Date(2025, 10, 15 + i),
          patientId: patientIds[i],
          createdBy: doctorIds[i % doctorIds.length]
        });
      }
      console.log(`  ✅ ${patientIds.length} medical records created`);
    } else {
      console.log(`  ✅ ${medicalRecordCount} medical records already exist`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   • 1 Admin User`);
    console.log(`   • ${doctorIds.length} Doctors`);
    console.log(`   • ${staffIds.length} Staff Members`);
    console.log(`   • ${patientIds.length} Patients`);
    console.log(`   • Appointments: Check database`);
    console.log(`   • Bills with Bill Items: Check database`);
    console.log(`   • ${INVENTORY.length} Inventory Items`);
    console.log(`   • Medical Records: Check database`);
    console.log('\n🔐 Default Credentials:');
    console.log('   Email: admin@hospital.com');
    console.log('   Password: admin@hospital.com');
    console.log('\n💡 For doctors/staff:');
    console.log('   Email: (their email address)');
    console.log('   Password: (same as email address)');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run seeder
seedDatabase();
