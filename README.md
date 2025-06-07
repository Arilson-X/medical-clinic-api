# Medical Clinic API

A RESTful API for managing a medical clinic built with Node.js, Express, TypeORM, and PostgreSQL.

## Features

- **Patient Management**: Create, read, update, and delete patient records
- **Doctor Management**: Manage doctor profiles and specializations
- **Appointment Scheduling**: Book and manage appointments between patients and doctors
- **Data Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Proper error handling and meaningful error messages
- **Database Relations**: Well-structured relationships between entities

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Database
- **TypeScript** - Programming language
- **class-validator** - Validation library

## Authentication

The API uses JWT (JSON Web Token) for authentication. All endpoints except registration and login require a valid JWT token.

### User Roles

- **ADMIN**: Full access to all resources
- **DOCTOR**: Can view patients, manage their own appointments
- **PATIENT**: Can view their own data and create appointments
- **RECEPTIONIST**: Can manage patients and appointments

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile (protected)
- `POST /api/auth/change-password` - Change password (protected)
- `POST /api/auth/refresh-token` - Refresh JWT token (protected)

### Using Authentication

Include the JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up your PostgreSQL database

4. Copy `.env.example` to `.env` and configure your database connection:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

5. Build the project:
   \`\`\`bash
   npm run build
   \`\`\`

6. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### Patients
- `POST /api/patients` - Create a new patient
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get a specific patient
- `PUT /api/patients/:id` - Update a patient
- `DELETE /api/patients/:id` - Delete a patient

### Doctors
- `POST /api/doctors` - Create a new doctor
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get a specific doctor
- `PUT /api/doctors/:id` - Update a doctor
- `DELETE /api/doctors/:id` - Delete a doctor

### Appointments
- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get a specific appointment
- `GET /api/appointments/doctor/:doctorId` - Get appointments for a specific doctor
- `GET /api/appointments/patient/:patientId` - Get appointments for a specific patient
- `PUT /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Delete an appointment

## Example Usage

### Create a Patient
\`\`\`bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "address": "123 Main St, City, State"
  }'
\`\`\`

### Create a Doctor
\`\`\`bash
curl -X POST http://localhost:3000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Dr. Jane",
    "lastName": "Smith",
    "email": "jane.smith@clinic.com",
    "phone": "+1234567891",
    "specialization": "Cardiology",
    "licenseNumber": "MD123456",
    "yearsOfExperience": 10
  }'
\`\`\`

### Create an Appointment
\`\`\`bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient-uuid",
    "doctorId": "doctor-uuid",
    "appointmentDateTime": "2024-01-15T10:00:00Z",
    "reason": "Regular checkup",
    "duration": 30
  }'
\`\`\`

### Authentication Examples

#### Register a new user
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@email.com",
    "password": "securepassword123",
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

#### Login
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@email.com",
    "password": "securepassword123"
  }'
\`\`\`

#### Access protected endpoint
\`\`\`bash
curl -X GET http://localhost:3000/api/patients \
  -H "Authorization: Bearer <your-jwt-token>"
\`\`\`

## Database Schema

The API uses three main entities:

- **Patient**: Stores patient information and medical history
- **Doctor**: Stores doctor profiles and specializations
- **Appointment**: Links patients and doctors with scheduling information

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Database constraint violations
- Not found errors
- Server errors

All errors return structured JSON responses with appropriate HTTP status codes.

To configure the application, create a `.env` file in the root directory with the following variables:

\`\`\`
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
