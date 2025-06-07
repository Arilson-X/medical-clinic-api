# Medical Clinic API

A RESTful API for managing a medical clinic built with Node.js, Express, TypeORM, and PostgreSQL with JWT authentication.

## Features

- **Patient Management**: Create, read, update, and delete patient records
- **Doctor Management**: Manage doctor profiles and specializations
- **Appointment Scheduling**: Book and manage appointments between patients and doctors
- **JWT Authentication**: Secure authentication with role-based access control
- **Data Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Proper error handling and meaningful error messages
- **Database Relations**: Well-structured relationships between entities

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Database
- **TypeScript** - Programming language
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **class-validator** - Validation library

## Authentication

The API uses JWT (JSON Web Token) for authentication. All endpoints except registration and login require a valid JWT token.

### User Roles

- **ADMIN**: Full access to all resources
- **DOCTOR**: Can view patients, manage their own appointments
- **PATIENT**: Can view their own data and create appointments
- **RECEPTIONIST**: Can manage patients and appointments

## Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up your PostgreSQL database

4. Copy `.env.example` to `.env` and configure your environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

5. Update the `.env` file with your configuration:
   \`\`\`env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=medical_clinic

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   \`\`\`

6. Build the project:
   \`\`\`bash
   npm run build
   \`\`\`

7. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### Authentication Routes (`/api/auth/`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile (protected)
- `POST /api/auth/change-password` - Change password (protected)
- `POST /api/auth/refresh-token` - Refresh JWT token (protected)

### Patient Routes (`/api/patients/`)
- `POST /api/patients` - Create a new patient (Admin/Receptionist only)
- `GET /api/patients` - Get all patients (Admin/Receptionist/Doctor only)
- `GET /api/patients/:id` - Get a specific patient (Owner or Staff only)
- `PUT /api/patients/:id` - Update a patient (Owner or Staff only)
- `DELETE /api/patients/:id` - Delete a patient (Admin only)

### Doctor Routes (`/api/doctors/`)
- `POST /api/doctors` - Create a new doctor (Admin only)
- `GET /api/doctors` - Get all doctors (Authenticated users)
- `GET /api/doctors/:id` - Get a specific doctor (Owner or Staff only)
- `PUT /api/doctors/:id` - Update a doctor (Owner or Staff only)
- `DELETE /api/doctors/:id` - Delete a doctor (Admin only)

### Appointment Routes (`/api/appointments/`)
- `POST /api/appointments` - Create a new appointment (Admin/Receptionist/Patient)
- `GET /api/appointments` - Get all appointments (Admin/Receptionist/Doctor)
- `GET /api/appointments/:id` - Get a specific appointment (Authenticated users)
- `GET /api/appointments/doctor/:doctorId` - Get appointments for a doctor
- `GET /api/appointments/patient/:patientId` - Get appointments for a patient
- `PUT /api/appointments/:id` - Update an appointment (Admin/Receptionist/Doctor)
- `DELETE /api/appointments/:id` - Delete an appointment (Admin/Receptionist)

## Complete API Testing Examples

### 1. Authentication Examples

#### 1.1 Register a New Admin User
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "admin123456",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
\`\`\`

#### 1.2 Register a New Doctor
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.smith@clinic.com",
    "password": "doctor123456",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "doctor",
    "profileData": {
      "phone": "+1234567891",
      "specialization": "Cardiology",
      "licenseNumber": "MD123456",
      "yearsOfExperience": 10
    }
  }'
\`\`\`

#### 1.3 Register a New Patient
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@email.com",
    "password": "patient123456",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient",
    "profileData": {
      "phone": "+1234567890",
      "dateOfBirth": "1990-01-01",
      "address": "123 Main St, City, State",
      "medicalHistory": "No known allergies"
    }
  }'
\`\`\`

#### 1.4 Register a Receptionist
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "receptionist@clinic.com",
    "password": "receptionist123456",
    "firstName": "Mary",
    "lastName": "Johnson",
    "role": "receptionist"
  }'
\`\`\`

#### 1.5 Login (Get JWT Token)
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "admin123456"
  }'
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "admin@clinic.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

#### 1.6 Get Current User Profile
\`\`\`bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

#### 1.7 Change Password
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "admin123456",
    "newPassword": "newpassword123456"
  }'
\`\`\`

#### 1.8 Refresh Token
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

### 2. Patient Management Examples

**Note:** Replace `YOUR_JWT_TOKEN` with the actual token received from login.

#### 2.1 Create a Patient (Admin/Receptionist only)
\`\`\`bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice.johnson@email.com",
    "phone": "+1234567892",
    "dateOfBirth": "1985-05-15",
    "address": "456 Oak Ave, City, State",
    "medicalHistory": "Diabetes Type 2"
  }'
\`\`\`

#### 2.2 Get All Patients (Admin/Receptionist/Doctor only)
\`\`\`bash
curl -X GET http://localhost:3000/api/patients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

#### 2.3 Get Specific Patient
\`\`\`bash
curl -X GET http://localhost:3000/api/patients/PATIENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

#### 2.4 Update Patient
\`\`\`bash
curl -X PUT http://localhost:3000/api/patients/PATIENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "phone": "+1234567899",
    "address": "789 New Street, City, State",
    "medicalHistory": "Diabetes Type 2, Hypertension"
  }'
\`\`\`

#### 2.5 Delete Patient (Admin only)
\`\`\`bash
curl -X DELETE http://localhost:3000/api/patients/PATIENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

### 3. Doctor Management Examples

#### 3.1 Create a Doctor (Admin only)
\`\`\`bash
curl -X POST http://localhost:3000/api/doctors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "Michael",
    "lastName": "Brown",
    "email": "dr.brown@clinic.com",
    "phone": "+1234567893",
    "specialization": "Neurology",
    "licenseNumber": "MD789012",
    "yearsOfExperience": 15
  }'
\`\`\`

#### 3.2 Get All Doctors
\`\`\`bash
curl -X GET http://localhost:3000/api/doctors \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

#### 3.3 Get Specific Doctor
\`\`\`bash
curl -X GET http://localhost:3000/api/doctors/DOCTOR_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

#### 3.4 Update Doctor
\`\`\`bash
curl -X PUT http://localhost:3000/api/doctors/DOCTOR_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "phone": "+1234567894",
    "yearsOfExperience": 16,
    "specialization": "Neurology and Pain Management"
  }'
\`\`\`

#### 3.5 Delete Doctor (Admin only)
\`\`\`bash
curl -X DELETE http://localhost:3000/api/doctors/DOCTOR_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

### 4. Appointment Management Examples

#### 4.1 Create an Appointment
\`\`\`bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "patientId": "PATIENT_UUID",
    "doctorId": "DOCTOR_UUID",
    "appointmentDateTime": "2024-02-15T10:00:00Z",
    "reason": "Regular checkup",
    "duration": 30,
    "notes": "Patient reports feeling well"
  }'
\`\`\`

#### 4.2 Get All Appointments (Admin/Receptionist/Doctor only)
\`\`\`bash
curl -X GET http://localhost:3000/api/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

#### 4.3 Get Specific Appointment
\`\`\`bash
curl -X GET http://localhost:3000/api/appointments/APPOINTMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

#### 4.4 Get Appointments for a Specific Doctor
\`\`\`bash
curl -X GET http://localhost:3000/api/appointments/doctor/DOCTOR_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

#### 4.5 Get Appointments for a Specific Patient
\`\`\`bash
curl -X GET http://localhost:3000/api/appointments/patient/PATIENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

#### 4.6 Update Appointment
\`\`\`bash
curl -X PUT http://localhost:3000/api/appointments/APPOINTMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "appointmentDateTime": "2024-02-15T14:00:00Z",
    "status": "completed",
    "notes": "Patient checkup completed. All vitals normal."
  }'
\`\`\`

#### 4.7 Delete Appointment (Admin/Receptionist only)
\`\`\`bash
curl -X DELETE http://localhost:3000/api/appointments/APPOINTMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

### 5. Health Check

#### 5.1 Check API Health (No authentication required)
\`\`\`bash
curl -X GET http://localhost:3000/health
\`\`\`

**Response:**
\`\`\`json
{
  "status": "OK",
  "message": "Medical Clinic API is running"
}
\`\`\`

## Testing Workflow Example

Here's a complete workflow to test the API:

### Step 1: Register Users
\`\`\`bash
# Register Admin
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "admin123456",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'

# Register Doctor
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.smith@clinic.com",
    "password": "doctor123456",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "doctor",
    "profileData": {
      "phone": "+1234567891",
      "specialization": "Cardiology",
      "licenseNumber": "MD123456",
      "yearsOfExperience": 10
    }
  }'

# Register Patient
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@email.com",
    "password": "patient123456",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient",
    "profileData": {
      "phone": "+1234567890",
      "dateOfBirth": "1990-01-01",
      "address": "123 Main St, City, State"
    }
  }'
\`\`\`

### Step 2: Login and Get Tokens
\`\`\`bash
# Login as Admin
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "admin123456"
  }' | jq -r '.data.token')

# Login as Doctor
DOCTOR_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.smith@clinic.com",
    "password": "doctor123456"
  }' | jq -r '.data.token')

# Login as Patient
PATIENT_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@email.com",
    "password": "patient123456"
  }' | jq -r '.data.token')
\`\`\`

### Step 3: Test CRUD Operations
\`\`\`bash
# Get all doctors (using admin token)
curl -X GET http://localhost:3000/api/doctors \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Get all patients (using doctor token)
curl -X GET http://localhost:3000/api/patients \
  -H "Authorization: Bearer $DOCTOR_TOKEN"

# Create appointment (using patient token)
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PATIENT_TOKEN" \
  -d '{
    "patientId": "PATIENT_UUID_FROM_REGISTRATION",
    "doctorId": "DOCTOR_UUID_FROM_REGISTRATION",
    "appointmentDateTime": "2024-02-15T10:00:00Z",
    "reason": "Regular checkup"
  }'
\`\`\`

## Error Responses

The API returns structured error responses:

### Validation Error (400)
\`\`\`json
{
  "message": "Validation failed",
  "errors": [
    {
      "property": "email",
      "constraints": {
        "isEmail": "Please provide a valid email address"
      }
    }
  ]
}
\`\`\`

### Authentication Error (401)
\`\`\`json
{
  "message": "Invalid or expired token"
}
\`\`\`

### Authorization Error (403)
\`\`\`json
{
  "message": "Insufficient permissions"
}
\`\`\`

### Not Found Error (404)
\`\`\`json
{
  "message": "Patient not found"
}
\`\`\`

### Server Error (500)
\`\`\`json
{
  "message": "Internal Server Error",
  "error": "Database connection failed"
}
\`\`\`

## Database Schema

The API uses four main entities:

- **User**: Authentication and authorization
- **Patient**: Patient information and medical history
- **Doctor**: Doctor profiles and specializations
- **Appointment**: Links patients and doctors with scheduling information

## Security Features

- **Password hashing** with bcryptjs (12 rounds)
- **JWT token authentication** with configurable expiration
- **Role-based access control** (RBAC)
- **Input validation** using class-validator
- **SQL injection protection** via TypeORM
- **CORS protection** enabled
- **Helmet security headers** applied

## Environment Variables

Create a `.env` file in the root directory:

\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=medical_clinic

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Notes

- Replace `YOUR_JWT_TOKEN` with actual tokens from login responses
- Replace UUID placeholders (`PATIENT_ID`, `DOCTOR_ID`, etc.) with actual UUIDs
- All timestamps should be in ISO 8601 format
- The API uses UUID v4 for all entity IDs
- Passwords are automatically hashed before storage
- JWT tokens expire based on the `JWT_EXPIRES_IN` environment variable
