# SmartHMS - Hospital Management System

A comprehensive hospital management system built with React, Node.js, Express, and TiDB Cloud.

## Features

- **Patient Management**: Complete patient records, medical history, and demographics
- **Appointment Scheduling**: Book, manage, and track appointments
- **Billing System**: Generate and manage bills with itemized services
- **Inventory Management**: Track medical supplies, equipment, and medications
- **User Roles**: Admin, Doctor, Nurse, Staff, and Patient roles with specific permissions
- **Analytics Dashboard**: Real-time insights and reporting
- **Secure Authentication**: JWT-based authentication with refresh tokens

## Tech Stack

### Frontend
- React 18
- Redux Toolkit for state management
- Material-UI (MUI) for UI components
- React Router for navigation
- Axios for API calls
- Formik & Yup for form validation
- Recharts for data visualization

### Backend
- Node.js & Express
- Sequelize ORM
- TiDB Cloud (MySQL-compatible distributed database)
- JWT authentication
- Winston for logging
- Express rate limiting & security middleware

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TiDB Cloud account (free tier available)

## Installation

### Quick Start (Recommended)

**Windows users:**
```bash
start.bat
```

**macOS/Linux users:**
```bash
bash start.sh
```

### Or Follow These Steps

### 1. Clone the repository
```bash
git clone <repository-url>
cd SmartHMS
```

### 2. Validate Project Setup (Optional but Recommended)
```bash
node validate.js
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration (TiDB Cloud)
DB_HOST=your-tidb-host.tidbcloud.com
DB_PORT=4000
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Run migrations:
```bash
npm run migrate
npm run seed
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend Server
```bash
cd backend
node server.js
```
The backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

## Default User Roles

The system automatically creates the following default roles:
- **Admin**: Full system access
- **Doctor**: Patient management, appointments, medical records
- **Nurse**: View patients, appointments, basic medical records
- **Staff**: Billing, inventory, appointment scheduling
- **Patient**: View own records, appointments, and bills

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh access token

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/status` - Update appointment status

### Billing
- `GET /api/billing` - Get all bills
- `POST /api/billing` - Create new bill
- `GET /api/billing/:id/pdf` - Generate bill PDF

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create inventory item
- `PATCH /api/inventory/:id/stock` - Update stock levels
- `GET /api/inventory/low-stock` - Get low stock items

## Database Schema

The application uses the following main tables:
- `users` - System users with role-based access
- `roles` - User roles and permissions
- `patients` - Patient records
- `appointments` - Appointment scheduling
- `medical_records` - Patient medical history
- `bills` & `bill_items` - Billing system
- `inventory` - Medical supplies and equipment
- `activity_logs` - System audit trail

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Helmet.js for HTTP headers security
- CORS configuration
- Input validation and sanitization
- Role-based access control (RBAC)

## Development

### Build Frontend for Production
```bash
cd frontend
npm run build
```

### Linting
```bash
cd frontend
npm run lint
```

## Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Update TiDB Cloud connection settings
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean, etc.)

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)
3. Update API base URL in `src/services/api.js`

## Documentation

For more detailed information, please refer to:

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Comprehensive setup and configuration guide
- **[VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)** - Complete verification checklist and testing guide
- **[validate.js](./validate.js)** - Automated project validation script

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
