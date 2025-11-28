#!/usr/bin/env node

/**
 * SmartHMS Configuration Validator
 * This script validates the project setup and configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}\n${colors.blue}${msg}${colors.reset}\n${colors.blue}${'='.repeat(50)}${colors.reset}`)
};

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

// Check if file exists
function fileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    log.success(`${description}: ${filePath}`);
    checks.passed++;
    return true;
  } else {
    log.error(`${description} not found: ${filePath}`);
    checks.failed++;
    return false;
  }
}

// Check if Node modules are installed
function checkNodeModules(dirName) {
  const modulePath = path.join(dirName, 'node_modules');
  if (fs.existsSync(modulePath)) {
    const packageCount = fs.readdirSync(modulePath).length;
    log.success(`${path.basename(dirName)} - node_modules installed (${packageCount} modules)`);
    checks.passed++;
    return true;
  } else {
    log.warning(`${path.basename(dirName)} - node_modules not installed`);
    checks.warnings++;
    return false;
  }
}

// Check file content
function checkFileContent(filePath, searchString, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchString)) {
      log.success(`${description}`);
      checks.passed++;
      return true;
    } else {
      log.error(`${description} - not found in file`);
      checks.failed++;
      return false;
    }
  } catch (err) {
    log.error(`${description} - Error reading file: ${err.message}`);
    checks.failed++;
    return false;
  }
}

// Check directory structure
function checkDirectory(dirPath, files, description) {
  let allExist = true;
  const missingFiles = [];

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (!fs.existsSync(fullPath)) {
      allExist = false;
      missingFiles.push(file);
    }
  });

  if (allExist) {
    log.success(`${description} - All files present`);
    checks.passed++;
  } else {
    log.error(`${description} - Missing: ${missingFiles.join(', ')}`);
    checks.failed++;
  }

  return allExist;
}

// Main validation
function validateProject() {
  console.clear();
  log.header('🔍 SmartHMS Project Validation');

  const rootDir = process.cwd();
  const backendDir = path.join(rootDir, 'backend');
  const frontendDir = path.join(rootDir, 'frontend');

  // Check root files
  log.info('Checking root directory...');
  fileExists(path.join(rootDir, 'README.md'), 'Root README');
  fileExists(path.join(rootDir, 'SETUP_GUIDE.md'), 'Setup guide');
  fileExists(path.join(rootDir, 'VERIFICATION_CHECKLIST.md'), 'Verification checklist');

  // Check backend structure
  log.header('Backend Validation');
  fileExists(path.join(backendDir, 'package.json'), 'Backend package.json');
  fileExists(path.join(backendDir, '.env'), 'Backend .env file');
  fileExists(path.join(backendDir, 'server.js'), 'Backend server.js');
  
  checkNodeModules(backendDir);

  const backendDirs = [
    'src/config',
    'src/controllers',
    'src/models',
    'src/routes',
    'src/services',
    'src/middleware',
    'src/validators',
    'migrations',
    'seeders'
  ];

  backendDirs.forEach(dir => {
    const fullPath = path.join(backendDir, dir);
    if (fs.existsSync(fullPath)) {
      log.success(`Backend directory exists: ${dir}`);
      checks.passed++;
    } else {
      log.error(`Backend directory missing: ${dir}`);
      checks.failed++;
    }
  });

  // Check backend model files
  const modelFiles = [
    'src/models/User.js',
    'src/models/Role.js',
    'src/models/Patient.js',
    'src/models/Appointment.js',
    'src/models/Bill.js',
    'src/models/Inventory.js',
    'src/models/MedicalRecord.js'
  ];

  log.info('Checking backend models...');
  modelFiles.forEach(file => {
    fileExists(path.join(backendDir, file), `Model: ${path.basename(file)}`);
  });

  // Check backend routes
  const routeFiles = [
    'src/routes/auth.js',
    'src/routes/patients.js',
    'src/routes/appointments.js',
    'src/routes/billing.js',
    'src/routes/inventory.js'
  ];

  log.info('Checking backend routes...');
  routeFiles.forEach(file => {
    fileExists(path.join(backendDir, file), `Route: ${path.basename(file)}`);
  });

  // Check backend controllers
  const controllerFiles = [
    'src/controllers/authController.js',
    'src/controllers/patientController.js',
    'src/controllers/appointmentController.js',
    'src/controllers/billingController.js',
    'src/controllers/InventoryController.js'
  ];

  log.info('Checking backend controllers...');
  controllerFiles.forEach(file => {
    fileExists(path.join(backendDir, file), `Controller: ${path.basename(file)}`);
  });

  // Check frontend structure
  log.header('Frontend Validation');
  fileExists(path.join(frontendDir, 'package.json'), 'Frontend package.json');
  fileExists(path.join(frontendDir, 'vite.config.js'), 'Vite configuration');
  fileExists(path.join(frontendDir, 'index.html'), 'Frontend index.html');

  checkNodeModules(frontendDir);

  const frontendDirs = [
    'src/components',
    'src/pages',
    'src/layouts',
    'src/redux',
    'src/services',
    'src/hooks',
    'src/utils'
  ];

  frontendDirs.forEach(dir => {
    const fullPath = path.join(frontendDir, dir);
    if (fs.existsSync(fullPath)) {
      log.success(`Frontend directory exists: ${dir}`);
      checks.passed++;
    } else {
      log.error(`Frontend directory missing: ${dir}`);
      checks.failed++;
    }
  });

  // Check frontend pages
  const pageFiles = [
    'src/pages/auth/Login.jsx',
    'src/pages/auth/Register.jsx',
    'src/pages/dashboard/AdminDashboard.jsx',
    'src/pages/patients/Patients.jsx',
    'src/pages/appointments/Appointments.jsx',
    'src/pages/billing/Billing.jsx',
    'src/pages/inventory/Inventory.jsx'
  ];

  log.info('Checking frontend pages...');
  pageFiles.forEach(file => {
    fileExists(path.join(frontendDir, file), `Page: ${path.basename(file)}`);
  });

  // Check frontend components
  log.info('Checking frontend components...');
  fileExists(path.join(frontendDir, 'src/layouts/MainLayout.jsx'), 'MainLayout component');
  fileExists(path.join(frontendDir, 'src/layouts/AuthLayout.jsx'), 'AuthLayout component');

  // Check Redux files
  log.info('Checking Redux configuration...');
  fileExists(path.join(frontendDir, 'src/redux/store.js'), 'Redux store');
  const sliceFiles = [
    'src/redux/slices/authSlice.js',
    'src/redux/slices/patientsSlice.js',
    'src/redux/slices/appointmentsSlice.js',
    'src/redux/slices/billingSlice.js',
    'src/redux/slices/inventorySlice.js'
  ];
  
  sliceFiles.forEach(file => {
    fileExists(path.join(frontendDir, file), `Slice: ${path.basename(file)}`);
  });

  // Check hooks
  log.info('Checking custom hooks...');
  fileExists(path.join(frontendDir, 'src/hooks/useAuth.js'), 'useAuth hook');

  // Check main files
  log.info('Checking main application files...');
  fileExists(path.join(frontendDir, 'src/App.jsx'), 'App.jsx');
  fileExists(path.join(frontendDir, 'src/main.jsx'), 'main.jsx');

  // Code validation
  log.header('Code Quality Checks');

  // Check Login.jsx has navigate in dependencies
  checkFileContent(
    path.join(frontendDir, 'src/pages/auth/Login.jsx'),
    '[isAuthenticated, navigate]',
    'Login.jsx has navigate in useEffect dependencies'
  );

  // Check Register.jsx has navigate in dependencies
  checkFileContent(
    path.join(frontendDir, 'src/pages/auth/Register.jsx'),
    '[isAuthenticated, navigate]',
    'Register.jsx has navigate in useEffect dependencies'
  );

  // Check ProtectedRoute handles arrays
  checkFileContent(
    path.join(frontendDir, 'src/App.jsx'),
    'Array.isArray(requiredRole)',
    'ProtectedRoute handles role arrays'
  );

  // Check backend .env has required fields
  log.info('Checking environment variables...');
  checkFileContent(
    path.join(backendDir, '.env'),
    'DB_HOST=',
    'Backend .env has DB_HOST'
  );

  checkFileContent(
    path.join(backendDir, '.env'),
    'JWT_SECRET=',
    'Backend .env has JWT_SECRET'
  );

  // Summary
  log.header('Validation Summary');
  console.log(`${colors.green}✅ Passed: ${checks.passed}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Warnings: ${checks.warnings}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${checks.failed}${colors.reset}`);

  if (checks.failed === 0) {
    log.success('All validations passed! Project is ready.');
    process.exit(0);
  } else {
    log.error(`${checks.failed} validation(s) failed. Please fix these issues.`);
    process.exit(1);
  }
}

// Run validation
validateProject();
