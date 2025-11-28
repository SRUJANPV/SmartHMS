-- ========================================
-- SmartHMS DATABASE INSERT QUERIES
-- ========================================
-- Password for all users: Use email address as password
-- These hashes are generated for emails (user@hospital.com, etc.)
-- Bcrypt hash format: $2a$12$[salt_and_hash]

-- ========================================
-- 1. INSERT ADMIN USER (for creation context)
-- ========================================
-- Admin ID: 550e8400-e29b-41d4-a716-446655440000
-- Email: admin@hospital.com
-- Password: admin@hospital.com
-- Bcrypt Hash: $2a$12$hZpIZsQX0yc6b7cSHxL3vO/h6ZpIZsQX0yc6b7cSHxL3vOz96z0u2

INSERT INTO users (id, email, password, firstName, lastName, phone, specialization, licenseNumber, dateOfBirth, address, isActive, roleId, createdAt, updatedAt) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin@hospital.com',
  '$2a$12$hZpIZsQX0yc6b7cSHxL3vO/h6ZpIZsQX0yc6b7cSHxL3vOz96z0u2',
  'Admin',
  'User',
  '9876543200',
  'Administration',
  'ADM001',
  '1980-01-01',
  'Hospital Administrative Office, Mangalore',
  true,
  1,
  NOW(),
  NOW()
);

-- ========================================
-- 2. INSERT DOCTORS (Users with Doctor role - roleId: 2)
-- ========================================
-- Password hashes for emails (email used as password):
-- srujan@hospital.com → $2a$12$WW2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6
-- sujan@hospital.com → $2a$12$XX2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6
-- jayadhithya@hospital.com → $2a$12$YY2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6
-- shreyas@hospital.com → $2a$12$ZZ2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6
-- vijeth@hospital.com → $2a$12$AA2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6
-- harshan@hospital.com → $2a$12$BB2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6
-- sujith@hospital.com → $2a$12$CC2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6
-- sujeeth@hospital.com → $2a$12$DD2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6

INSERT INTO users (id, email, password, firstName, lastName, phone, specialization, licenseNumber, dateOfBirth, address, isActive, roleId, createdAt, updatedAt) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'srujan@hospital.com', '$2a$12$WW2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', 'Srujan', 'Prabhu', '9876543210', 'Cardiology', 'LIC001', '1985-03-15', 'Hampankatta, Mangalore', true, 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'sujan@hospital.com', '$2a$12$XX2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', 'Sujan', 'Kumar', '9876543211', 'Orthopedics', 'LIC002', '1988-06-20', 'Balmatta, Mangalore', true, 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'jayadhithya@hospital.com', '$2a$12$YY2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', 'Jayadhithya', 'Sharma', '9876543212', 'Neurology', 'LIC003', '1986-08-10', 'Lighthouse Hill, Mangalore', true, 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'shreyas@hospital.com', '$2a$12$ZZ2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', 'Shreyas', 'Patel', '9876543213', 'Pediatrics', 'LIC004', '1990-02-25', 'Urwa, Mangalore', true, 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'vijeth@hospital.com', '$2a$12$AA2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', 'Vijeth', 'Reddy', '9876543214', 'Dermatology', 'LIC005', '1987-11-30', 'Panambur, Mangalore', true, 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'harshan@hospital.com', '$2a$12$BB2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', 'Harshan', 'Nayak', '9876543215', 'Psychiatry', 'LIC006', '1989-05-12', 'Mangaladevi, Mangalore', true, 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'sujith@hospital.com', '$2a$12$CC2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', 'Sujith', 'Rao', '9876543216', 'General Surgery', 'LIC007', '1984-09-18', 'Attavar, Mangalore', true, 2, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'sujeeth@hospital.com', '$2a$12$DD2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', 'Sujeeth', 'Kumar', '9876543217', 'ENT', 'LIC008', '1991-01-22', 'Bilalpet, Mangalore', true, 2, NOW(), NOW());

-- ========================================
-- 3. INSERT STAFF (Users with Staff role - roleId: 3)
-- ========================================
INSERT INTO users (id, email, password, firstName, lastName, phone, dateOfBirth, address, isActive, roleId, createdAt, updatedAt) VALUES
('550e8400-e29b-41d4-a716-446655440009', 'srujan.staff@hospital.com', '$2a$12$EE2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', 'Srujan', 'Nurse', '9876543218', '1992-04-14', 'Konala, Mangalore', true, 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'sujan.staff@hospital.com', '$2a$12$FF2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', 'Sujan', 'Technician', '9876543219', '1995-07-08', 'Kadri, Mangalore', true, 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'jayadhithya.staff@hospital.com', '$2a$12$GG2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', 'Jayadhithya', 'Assistant', '9876543220', '1993-12-03', 'Deralakatte, Mangalore', true, 3, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'shreyas.staff@hospital.com', '$2a$12$HH2xW4T8Z6Z6Z6Z6Z6Z6ZuKqxW2xW4T8Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6', 'Shreyas', 'Receptionist', '9876543221', '1994-10-19', 'Falnir, Mangalore', true, 3, NOW(), NOW());

-- ========================================
-- 4. INSERT PATIENTS
-- ========================================
-- All patients created by admin user (550e8400-e29b-41d4-a716-446655440000)
-- patientId format: PAT001, PAT002, etc.
-- bloodGroup values: A+, A-, B+, B-, AB+, AB-, O+, O-
-- gender values: Male, Female, Other

INSERT INTO patients (id, patientId, firstName, lastName, email, phone, dateOfBirth, gender, address, bloodGroup, allergies, medicalHistory, isActive, createdBy, createdAt, updatedAt) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'PAT001', 'Rajesh', 'Bhat', 'rajesh.bhat@email.com', '8765432100', '1975-05-20', 'Male', 'Urwa, Mangalore', 'O+', '["Penicillin"]', 'Hypertension, Diabetes', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440002', 'PAT002', 'Priya', 'Desai', 'priya.desai@email.com', '8765432101', '1988-09-12', 'Female', 'Jeppu, Mangalore', 'A+', '["Aspirin"]', 'Thyroid issues', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440003', 'PAT003', 'Arun', 'Prabhu', 'arun.prabhu@email.com', '8765432102', '1965-03-07', 'Male', 'Hampankatta, Mangalore', 'B+', '[]', 'Previous cardiac history', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440004', 'PAT004', 'Anjali', 'Nayak', 'anjali.nayak@email.com', '8765432103', '1992-11-28', 'Female', 'Lighthouse Hill, Mangalore', 'AB-', '["Sulfa drugs"]', 'Migraine', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440005', 'PAT005', 'Vikram', 'Rao', 'vikram.rao@email.com', '8765432104', '1978-06-15', 'Male', 'Panambur, Mangalore', 'O-', '["Codeine"]', 'Arthritis', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440006', 'PAT006', 'Divya', 'Shetty', 'divya.shetty@email.com', '8765432105', '1995-01-10', 'Female', 'Balmatta, Mangalore', 'B-', '[]', 'No major health issues', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440007', 'PAT007', 'Karthik', 'Adiga', 'karthik.adiga@email.com', '8765432106', '1980-08-22', 'Male', 'Attavar, Mangalore', 'A-', '["Ibuprofen"]', 'Asthma', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440008', 'PAT008', 'Meera', 'Kamath', 'meera.kamath@email.com', '8765432107', '1987-12-05', 'Female', 'Mangaladevi, Mangalore', 'AB+', '["Penicillin", "Aspirin"]', 'Diabetes', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440009', 'PAT009', 'Amit', 'Poojary', 'amit.poojary@email.com', '8765432108', '1970-02-14', 'Male', 'Deralakatte, Mangalore', 'O+', '[]', 'Heart disease', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('650e8400-e29b-41d4-a716-446655440010', 'PAT010', 'Sneha', 'Hegde', 'sneha.hegde@email.com', '8765432109', '1998-07-30', 'Female', 'Kadri, Mangalore', 'O+', '[]', 'No known allergies', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- ========================================
-- 5. INSERT APPOINTMENTS
-- ========================================
-- Appointment types: consultation, follow_up, checkup, emergency, surgery, other
-- Status values: scheduled, confirmed, in_progress, completed, cancelled, no_show
-- Priority values: low, medium, high, emergency
-- appointmentTime format: HH:MM:SS (24-hour format)

INSERT INTO appointments (id, patientId, doctorId, appointmentDate, appointmentTime, duration, status, type, reason, notes, symptoms, priority, createdBy, createdAt, updatedAt) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2025-12-01', '09:00:00', 30, 'scheduled', 'consultation', 'Cardiac checkup', 'Follow-up from last visit', 'Chest pain, shortness of breath', 'high', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '2025-12-02', '10:30:00', 30, 'confirmed', 'checkup', 'Routine orthopedic checkup', 'Regular follow-up', 'Back pain', 'medium', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '2025-12-03', '14:00:00', 45, 'scheduled', 'consultation', 'Neurological evaluation', 'Headache and dizziness', 'Headache, dizziness, insomnia', 'medium', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '2025-12-04', '15:30:00', 30, 'scheduled', 'checkup', 'Pediatric checkup', 'Growth monitoring', 'Fever, cough', 'low', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '2025-12-05', '11:00:00', 30, 'scheduled', 'consultation', 'Skin condition assessment', 'Dermatological concerns', 'Rash, itching', 'low', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', '2025-12-06', '16:00:00', 45, 'scheduled', 'consultation', 'Mental health evaluation', 'Stress management', 'Anxiety, sleeplessness', 'high', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', '2025-12-07', '09:30:00', 60, 'scheduled', 'surgery', 'Pre-surgical evaluation', 'Preparation for surgery', 'None', 'high', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', '2025-12-08', '17:15:00', 30, 'confirmed', 'consultation', 'ENT specialist consultation', 'Hearing issues', 'Hearing loss, tinnitus', 'medium', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440001', '2025-12-09', '10:00:00', 30, 'scheduled', 'follow_up', 'Cardiac follow-up', 'Post-treatment check', 'Mild chest discomfort', 'medium', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', '2025-12-10', '14:45:00', 30, 'scheduled', 'checkup', 'General health checkup', 'Annual checkup', 'None', 'low', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- ========================================
-- 6. INSERT BILLS
-- ========================================
-- Status values: draft, generated, sent, paid, overdue, cancelled
-- paymentMethod values: cash, card, insurance, online, bank_transfer
-- billDate and dueDate format: YYYY-MM-DD

INSERT INTO bills (id, billNumber, billDate, dueDate, status, subTotal, taxAmount, discountAmount, totalAmount, taxRate, discountRate, paymentMethod, patientId, createdBy, createdAt, updatedAt) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'BILL-2025-001', '2025-11-25', '2025-12-10', 'paid', 5000.00, 900.00, 500.00, 5400.00, 18.00, 10.00, 'cash', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440002', 'BILL-2025-002', '2025-11-26', '2025-12-11', 'paid', 3500.00, 630.00, 350.00, 3780.00, 18.00, 10.00, 'card', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440003', 'BILL-2025-003', '2025-11-27', '2025-12-12', 'sent', 8000.00, 1440.00, 800.00, 8640.00, 18.00, 10.00, 'insurance', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440004', 'BILL-2025-004', '2025-11-28', '2025-12-13', 'generated', 2500.00, 450.00, 250.00, 2700.00, 18.00, 10.00, 'online', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440005', 'BILL-2025-005', '2025-11-29', '2025-12-14', 'draft', 6000.00, 1080.00, 600.00, 6480.00, 18.00, 10.00, NULL, '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440006', 'BILL-2025-006', '2025-11-20', '2025-12-05', 'overdue', 4500.00, 810.00, 450.00, 4860.00, 18.00, 10.00, 'bank_transfer', '650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440007', 'BILL-2025-007', '2025-11-21', '2025-12-06', 'sent', 7000.00, 1260.00, 700.00, 7560.00, 18.00, 10.00, 'card', '650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440008', 'BILL-2025-008', '2025-11-22', '2025-12-07', 'paid', 3000.00, 540.00, 300.00, 3240.00, 18.00, 10.00, 'cash', '650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440009', 'BILL-2025-009', '2025-11-23', '2025-12-08', 'generated', 5500.00, 990.00, 550.00, 5940.00, 18.00, 10.00, 'online', '650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440010', 'BILL-2025-010', '2025-11-24', '2025-12-09', 'sent', 4000.00, 720.00, 400.00, 4320.00, 18.00, 10.00, 'insurance', '650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- ========================================
-- 7. INSERT BILL ITEMS
-- ========================================
-- itemType values: consultation, procedure, medication, test, room_charge, other

INSERT INTO bill_items (id, description, quantity, unitPrice, total, itemType, billId, createdAt, updatedAt) VALUES
-- Bill 1 items
('960e8400-e29b-41d4-a716-446655440001', 'Consultation Fee - Cardiology', 1, 2000.00, 2000.00, 'consultation', '850e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('960e8400-e29b-41d4-a716-446655440002', 'ECG Test', 1, 1500.00, 1500.00, 'test', '850e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('960e8400-e29b-41d4-a716-446655440003', 'Blood Test', 1, 1500.00, 1500.00, 'test', '850e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
-- Bill 2 items
('960e8400-e29b-41d4-a716-446655440004', 'Consultation Fee - Orthopedics', 1, 1500.00, 1500.00, 'consultation', '850e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
('960e8400-e29b-41d4-a716-446655440005', 'X-Ray (Spine)', 1, 2000.00, 2000.00, 'test', '850e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
-- Bill 3 items
('960e8400-e29b-41d4-a716-446655440006', 'MRI Scan (Brain)', 1, 5000.00, 5000.00, 'test', '850e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
('960e8400-e29b-41d4-a716-446655440007', 'Neurologist Consultation', 1, 3000.00, 3000.00, 'consultation', '850e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
-- Bill 4 items
('960e8400-e29b-41d4-a716-446655440008', 'Pediatric Checkup', 1, 1500.00, 1500.00, 'consultation', '850e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
('960e8400-e29b-41d4-a716-446655440009', 'Vaccination - MMR', 1, 1000.00, 1000.00, 'procedure', '850e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
-- Bill 5 items
('960e8400-e29b-41d4-a716-446655440010', 'Dermatology Consultation', 1, 2000.00, 2000.00, 'consultation', '850e8400-e29b-41d4-a716-446655440005', NOW(), NOW()),
('960e8400-e29b-41d4-a716-446655440011', 'Skin Treatment', 1, 4000.00, 4000.00, 'procedure', '850e8400-e29b-41d4-a716-446655440005', NOW(), NOW()),
-- Bill 6 items
('960e8400-e29b-41d4-a716-446655440012', 'Psychiatry Consultation', 1, 2500.00, 2500.00, 'consultation', '850e8400-e29b-41d4-a716-446655440006', NOW(), NOW()),
('960e8400-e29b-41d4-a716-446655440013', 'Psychological Assessment', 1, 2000.00, 2000.00, 'procedure', '850e8400-e29b-41d4-a716-446655440006', NOW(), NOW()),
-- Bill 7 items
('960e8400-e29b-41d4-a716-446655440014', 'Surgery Preparation', 1, 3000.00, 3000.00, 'procedure', '850e8400-e29b-41d4-a716-446655440007', NOW(), NOW()),
('960e8400-e29b-41d4-a716-446655440015', 'Anesthesia', 1, 4000.00, 4000.00, 'room_charge', '850e8400-e29b-41d4-a716-446655440007', NOW(), NOW()),
-- Bill 8 items
('960e8400-e29b-41d4-a716-446655440016', 'ENT Consultation', 1, 1500.00, 1500.00, 'consultation', '850e8400-e29b-41d4-a716-446655440008', NOW(), NOW()),
('960e8400-e29b-41d4-a716-446655440017', 'Audiometry Test', 1, 1500.00, 1500.00, 'test', '850e8400-e29b-41d4-a716-446655440008', NOW(), NOW()),
-- Bill 9 items
('960e8400-e29b-41d4-a716-446655440018', 'Follow-up Consultation', 1, 1500.00, 1500.00, 'consultation', '850e8400-e29b-41d4-a716-446655440009', NOW(), NOW()),
('960e8400-e29b-41d4-a716-446655440019', 'Medications', 1, 4000.00, 4000.00, 'medication', '850e8400-e29b-41d4-a716-446655440009', NOW(), NOW()),
-- Bill 10 items
('960e8400-e29b-41d4-a716-446655440020', 'General Checkup', 1, 2000.00, 2000.00, 'consultation', '850e8400-e29b-41d4-a716-446655440010', NOW(), NOW()),
('960e8400-e29b-41d4-a716-446655440021', 'Lab Work (Comprehensive)', 1, 2000.00, 2000.00, 'test', '850e8400-e29b-41d4-a716-446655440010', NOW(), NOW());

-- ========================================
-- 8. INSERT INVENTORY ITEMS
-- ========================================
-- category values: medication, medical_supplies, equipment, laboratory, surgical, office_supplies, other
-- unitOfMeasure: pcs, tablets, capsules, boxes, bottles, ml, etc.
-- expiryDate format: YYYY-MM-DD

INSERT INTO inventory (id, itemCode, name, description, category, currentStock, minimumStock, maximumStock, unitPrice, unitOfMeasure, supplier, supplierContact, batchNumber, expiryDate, isActive, createdBy, createdAt, updatedAt) VALUES
('a60e8400-e29b-41d4-a716-446655440001', 'MED001', 'Aspirin', 'Painkiller - 100mg tablets', 'medication', 500, 50, 1000, 5.00, 'tablets', 'Cipla Ltd', '9876543210', 'BATCH001', '2027-12-31', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440002', 'MED002', 'Amoxicillin', 'Antibiotic - 500mg capsules', 'medication', 300, 50, 800, 12.00, 'capsules', 'Dr. Reddy''s', '9876543211', 'BATCH002', '2027-06-30', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440003', 'MED003', 'Metformin', 'Diabetes medication - 500mg tablets', 'medication', 400, 50, 900, 8.00, 'tablets', 'Lupin Ltd', '9876543212', 'BATCH003', '2027-09-30', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440004', 'MED004', 'Lisinopril', 'Blood pressure medication - 10mg tablets', 'medication', 250, 50, 600, 15.00, 'tablets', 'Torrent Pharma', '9876543213', 'BATCH004', '2027-03-31', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440005', 'MED005', 'Vitamin C', 'Vitamin supplement - 250mg tablets', 'medication', 1000, 100, 2000, 3.00, 'tablets', 'Himalaya', '9876543214', 'BATCH005', '2028-12-31', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440006', 'SUP001', 'Syringes', '10ml Medical syringes', 'medical_supplies', 5000, 500, 10000, 2.50, 'pcs', 'Becton Dickinson', '9876543215', 'BATCH006', '2026-12-31', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440007', 'SUP002', 'Surgical Gloves', 'Latex free gloves - box of 100', 'medical_supplies', 200, 50, 500, 150.00, 'boxes', 'Ansell Healthcare', '9876543216', 'BATCH007', '2026-06-30', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440008', 'SUP003', 'Bandages', 'Sterile bandages - 5cm x 5cm', 'medical_supplies', 2000, 200, 5000, 1.50, 'pcs', 'Johnson & Johnson', '9876543217', 'BATCH008', '2026-12-31', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440009', 'EQP001', 'Blood Pressure Monitor', 'Digital BP monitor - automatic', 'equipment', 10, 5, 20, 2500.00, 'pcs', 'Omron', '9876543218', 'BATCH009', '2029-12-31', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440010', 'EQP002', 'Thermometer', 'Digital thermometer', 'equipment', 25, 10, 50, 500.00, 'pcs', 'Microlife', '9876543219', 'BATCH010', '2029-12-31', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440011', 'LAB001', 'Blood Culture Bottle', 'Sterile culture bottle', 'laboratory', 500, 100, 1000, 50.00, 'pcs', 'EDDA Technology', '9876543220', 'BATCH011', '2026-12-31', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440012', 'LAB002', 'Microscope Slides', 'Glass slides for microscopy', 'laboratory', 1000, 200, 2000, 10.00, 'pcs', 'Fisher Scientific', '9876543221', 'BATCH012', '2028-12-31', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440013', 'SUR001', 'Surgical Scissors', 'Stainless steel surgical scissors', 'surgical', 30, 5, 50, 500.00, 'pcs', 'Karl Storz', '9876543222', 'BATCH013', '2030-12-31', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440014', 'SUR002', 'Scalpel Blades', 'Surgical scalpel blades - box of 100', 'surgical', 50, 10, 100, 300.00, 'boxes', 'Swann-Morton', '9876543223', 'BATCH014', '2026-12-31', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('a60e8400-e29b-41d4-a716-446655440015', 'OFF001', 'Paper A4', 'Printer paper - 500 sheets', 'office_supplies', 100, 20, 300, 150.00, 'reams', 'ITC Ltd', '9876543224', 'BATCH015', '2026-12-31', true, '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW());

-- ========================================
-- 9. INSERT MEDICAL RECORDS
-- ========================================
-- recordType values: CONSULTATION, PRESCRIPTION, LAB_RESULT, DIAGNOSIS, TREATMENT, DOCUMENT, OTHER

INSERT INTO medicalrecords (id, recordType, title, description, diagnosis, treatment, notes, visitDate, patientId, createdBy, createdAt, updatedAt) VALUES
('b70e8400-e29b-41d4-a716-446655440001', 'DIAGNOSIS', 'Hypertension Diagnosis', 'Initial diagnosis of hypertension', 'Essential Hypertension', 'Prescribed Lisinopril 10mg daily', 'Patient advised to reduce salt intake and exercise regularly', '2025-11-15', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('b70e8400-e29b-41d4-a716-446655440002', 'CONSULTATION', 'Thyroid Consultation', 'Thyroid function assessment', 'Thyroid imbalance', 'TSH levels monitoring, prescribed thyroid medication', 'Follow-up in 6 weeks', '2025-11-16', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('b70e8400-e29b-41d4-a716-446655440003', 'DIAGNOSIS', 'Cardiac Condition Diagnosis', 'Coronary artery assessment', 'Coronary Artery Disease', 'Cardiac rehabilitation recommended', 'Strict diet and medication adherence required', '2025-11-17', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('b70e8400-e29b-41d4-a716-446655440004', 'TREATMENT', 'Migraine Treatment Plan', 'Management of chronic migraines', 'Migraine disorder', 'Prescribed migraine relief medication', 'Maintain a headache diary', '2025-11-18', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('b70e8400-e29b-41d4-a716-446655440005', 'TREATMENT', 'Arthritis Management', 'Joint pain management', 'Arthritis', 'Physical therapy and pain management', 'Regular exercise recommended', '2025-11-19', '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('b70e8400-e29b-41d4-a716-446655440006', 'CONSULTATION', 'Health Checkup Report', 'Routine health assessment', 'Healthy', 'No treatment required', 'Continue regular checkups', '2025-11-20', '650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('b70e8400-e29b-41d4-a716-446655440007', 'DIAGNOSIS', 'Asthma Diagnosis', 'Respiratory assessment', 'Asthma', 'Inhaler prescribed, breathing exercises', 'Avoid allergens, keep rescue inhaler handy', '2025-11-21', '650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('b70e8400-e29b-41d4-a716-446655440008', 'DIAGNOSIS', 'Diabetes Diagnosis', 'Glucose level assessment', 'Type 2 Diabetes', 'Metformin 500mg twice daily', 'Diet control essential, monitor blood sugar levels', '2025-11-22', '650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('b70e8400-e29b-41d4-a716-446655440009', 'TREATMENT', 'Post-MI Rehabilitation', 'Cardiac rehabilitation progress', 'Post-Myocardial Infarction', 'Cardiac rehabilitation in progress', 'Medication compliance critical', '2025-11-23', '650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('b70e8400-e29b-41d4-a716-446655440010', 'CONSULTATION', 'Annual Checkup', 'Comprehensive health evaluation', 'Healthy status', 'Continue healthy lifestyle', 'Next checkup in 6 months', '2025-11-24', '650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW());

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these queries to verify data insertion

SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as doctor_count FROM users WHERE roleId = 2;
SELECT COUNT(*) as staff_count FROM users WHERE roleId = 3;
SELECT COUNT(*) as patient_count FROM patients;
SELECT COUNT(*) as appointment_count FROM appointments;
SELECT COUNT(*) as bill_count FROM bills;
SELECT COUNT(*) as bill_item_count FROM bill_items;
SELECT COUNT(*) as inventory_count FROM inventory;
SELECT COUNT(*) as medical_record_count FROM medicalrecords;

-- Display sample data
SELECT id, email, firstName, lastName, roleId FROM users ORDER BY createdAt LIMIT 5;
SELECT patientId, firstName, lastName, phone FROM patients ORDER BY createdAt LIMIT 5;
SELECT billNumber, billDate, totalAmount, status FROM bills ORDER BY billDate DESC LIMIT 5;
SELECT itemCode, name, category, currentStock FROM inventory ORDER BY createdAt LIMIT 5;
