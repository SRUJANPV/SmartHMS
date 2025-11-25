const generatePatientId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PT${timestamp}${random}`;
};

const generateBillNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${timestamp}-${random}`;
};

const generateItemCode = (category = 'other') => {
  const prefix = {
    medication: 'MED',
    medical_supplies: 'MS',
    equipment: 'EQP',
    laboratory: 'LAB',
    surgical: 'SUR',
    office_supplies: 'OFF',
    other: 'ITM'
  }[category] || 'ITM';
  
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

const formatPhoneNumber = (phone) => {
  return phone.replace(/\D/g, '');
};

const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  return input;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

module.exports = {
  generatePatientId,
  generateBillNumber,
  generateItemCode,
  formatPhoneNumber,
  calculateAge,
  sanitizeInput,
  formatCurrency
};