# Medical Clinic API

A RESTful API for managing a medical clinic built with Node.js, Express, TypeORM, and PostgreSQL with JWT authentication. Fully containerized with Docker.

## Features

- **Patient Management**: Create, read, update, and delete patient records
- **Doctor Management**: Manage doctor profiles and specializations
- **Appointment Scheduling**: Book and manage appointments between patients and doctors
- **JWT Authentication**: Secure authentication with role-based access control
- **Data Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Proper error handling and meaningful error messages
- **Database Relations**: Well-structured relationships between entities
- **Docker Support**: Fully containerized application with Docker Compose

## Tech Stack

- **Node.js 22** - Runtime environment
- **Express.js** - Web framework
- **TypeORM** - Object-Relational Mapping
- **PostgreSQL 15** - Database
- **TypeScript** - Programming language
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **class-validator** - Validation library
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### 1. Clone and Setup
\`\`\`bash
git clone <repository-url>
cd medical-clinic-api
\`\`\`

### 2. Environment Configuration
\`\`\`bash
# Copy environment template
cp .env.docker .env

# Edit .env file with your configuration
nano .env
\`\`\`

### 3. Start with Docker Compose

#### Production Mode
\`\`\`bash
# Build and start containers
make up

# Or using docker-compose directly
docker-compose up -d

# View logs
make logs
\`\`\`

#### Development Mode
\`\`\`bash
# Start development containers with hot reload
make dev

# View development logs
make dev-logs
\`\`\`

### 4. Verify Installation
\`\`\`bash
# Check container status
make status

# Test API health
curl http://localhost:3000/health

# Test API readiness
curl http://localhost:3000/ready
\`\`\`

## Docker Commands

### Using Makefile (Recommended)
\`\`\`bash
# View all available commands
make help

# Production commands
make build      # Build Docker images
make up         # Start production containers
make down       # Stop production containers
make logs       # View production logs
make rebuild    # Rebuild and restart containers

# Development commands
make dev        # Start development containers
make dev-down   # Stop development containers
make dev-logs   # View development logs

# Utility commands
make clean      # Clean up containers and volumes
make status     # Show container status
make shell-api  # Access API container shell
make shell-db   # Access database container shell
\`\`\`

### Using Docker Compose Directly
\`\`\`bash
# Production
docker-compose up -d
docker-compose down
docker-compose logs -f

# Development
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml logs -f
\`\`\`

### Using npm Scripts
\`\`\`bash
npm run docker:up      # Start production containers
npm run docker:down    # Stop production containers
npm run docker:dev     # Start development containers
npm run docker:logs    # View logs
npm run docker:clean   # Clean up everything
\`\`\`

## Container Architecture

### Services
1. **PostgreSQL Container**
   - Image: `postgres:15-alpine`
   - Port: `5432` (mapped to host `5432` or `5433` for dev)
   - Volume: Persistent data storage
   - Health checks: Built-in PostgreSQL health checks

2. **API Container**
   - Base: `node:22-alpine`
   - Port: `3000`
   - Multi-stage build (development/production)
   - Health checks: HTTP endpoint monitoring
   - Graceful shutdown handling

### Networking
- Custom bridge network for service communication
- Services communicate using service names
- External access via mapped ports

## Environment Variables

### Required Variables
\`\`\`env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_NAME=medical_clinic

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=production
\`\`\`

### Optional Variables
\`\`\`env
# Port mapping
API_PORT=3000

# Development database
DB_NAME=medical_clinic_dev
\`\`\`

## Development Workflow

### 1. Start Development Environment
\`\`\`bash
make dev
\`\`\`

### 2. View Logs
\`\`\`bash
make dev-logs
\`\`\`

### 3. Access Containers
\`\`\`bash
# API container shell
make shell-api-dev

# Database shell
make shell-db-dev
\`\`\`

### 4. Code Changes
- Code changes are automatically reflected (hot reload)
- TypeScript compilation happens in real-time
- Database schema changes sync automatically in development

## Production Deployment

### 1. Build Production Images
\`\`\`bash
make build
\`\`\`

### 2. Start Production Services
\`\`\`bash
make up
\`\`\`

### 3. Monitor Health
\`\`\`bash
# Check container status
docker-compose ps

# Monitor logs
make logs

# Health check
curl http://localhost:3000/health
\`\`\`

## Database Management

### Backup Database
\`\`\`bash
make db-backup
\`\`\`

### Restore Database
\`\`\`bash
make db-restore FILE=backup_20240101_120000.sql
\`\`\`

### Access Database
\`\`\`bash
# Production
make shell-db

# Development
make shell-db-dev
\`\`\`

## Health Checks

### API Health Check
\`\`\`bash
curl http://localhost:3000/health
\`\`\`

**Response:**
\`\`\`json
{
  "status": "OK",
  "message": "Medical Clinic API is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
\`\`\`

### API Readiness Check
\`\`\`bash
curl http://localhost:3000/ready
\`\`\`

**Response:**
\`\`\`json
{
  "status": "READY",
  "message": "API is ready to serve requests",
  "database": "connected"
}
\`\`\`

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
\`\`\`bash
# Check if PostgreSQL container is running
docker-compose ps

# Check PostgreSQL logs
docker-compose logs postgres

# Restart containers
make rebuild
\`\`\`

#### 2. Port Already in Use
\`\`\`bash
# Change port in .env file
API_PORT=3001
DB_PORT=5433

# Restart containers
make down && make up
\`\`\`

#### 3. Permission Issues
\`\`\`bash
# Clean up and rebuild
make clean
make rebuild
\`\`\`

### Logs and Debugging
\`\`\`bash
# View all logs
make logs

# View specific service logs
docker-compose logs api
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f api
\`\`\`

## API Testing with Docker

Once the containers are running, you can test the API using the same curl commands as before, but make sure to use the correct port:

### 1. Register a User
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

### 2. Login and Get Token
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "admin123456"
  }'
\`\`\`

### 3. Test Protected Endpoints
\`\`\`bash
curl -X GET http://localhost:3000/api/patients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

## Security Considerations

- Change default passwords in production
- Use strong JWT secrets
- Enable SSL/TLS in production
- Regularly update Docker images
- Monitor container logs
- Implement proper backup strategies

## Performance Optimization

- Database connection pooling configured
- Multi-stage Docker builds for smaller images
- Health checks for container orchestration
- Graceful shutdown handling
- Resource limits can be configured in docker-compose.yml

## Monitoring and Logging

- Container health checks
- Application health endpoints
- Structured logging
- Log aggregation ready
- Metrics collection ready

For more detailed API documentation and testing examples, see the API Testing section above.
