# DzCareBytes 🏥

**DzCareBytes** is a modular backend system for hospital management, built with **Express.js**, **Prisma ORM**, and **PostgreSQL**. This project is part of the final assignment for the *Service-Oriented Architecture* course.

## 🔧 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Message Queue**: RabbitMQ
- **Email Service**: Nodemailer (Gmail)
- **Payment Gateway**: DOKU Sandbox
- **Containerization**: Docker, Docker Compose

## 📁 Project Structure

```
dzcarebytes-backend/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Entry point
│   ├── routes/                # Central route definitions
│   ├── modules/               # Feature-based modules
│   │   ├── admin/             # Admin management
│   │   ├── patient/           # Patient management
│   │   ├── doctor/            # Doctor management
│   │   ├── scheduling/        # Appointment scheduling
│   │   ├── medical_records/   # Medical records
│   │   ├── medicine/          # Medicine inventory
│   │   ├── billing/           # Billing system
│   │   ├── payment/           # Payment gateway
│   │   └── authorization/     # Authentication
│   ├── middlewares/           # Error and auth handling
│   ├── services/              # Email and external services
│   ├── workers/               # Background workers
│   └── config/                # Database and RabbitMQ config
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.js                # Database seeder
├── docker-compose.yml         # Docker services
├── Dockerfile                 # Application container
└── .env.example               # Environment template
```

## 🚀 Getting Started

### **Method 1: Docker Deployment (Recommended)**

#### **Prerequisites**
- Docker and Docker Compose installed
- Git

#### **Step 1: Clone Repository**
```bash
git clone <your-repo-url>
cd dzcarebytes-backend
```

#### **Step 2: Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your credentials
# nano .env  # Linux/Mac
# notepad .env  # Windows
```

#### **Step 3: 🚨 Fix Line Endings (Windows Users)**

> **⚠️ IMPORTANT FOR WINDOWS USERS:**  
> If you're using Windows, you **MUST** fix the line endings of the `wait-for-it.sh` file before running Docker. This is a common issue that causes the error: `/usr/bin/env: 'bash\r': No such file or directory`

**Option A: Using VS Code (Recommended)**
```bash
1. Open wait-for-it.sh in VS Code
2. Look at the bottom-right corner of VS Code
3. Click on "CRLF" and change it to "LF"
4. Save the file (Ctrl+S)
```

**Option B: Using Git**
```bash
# Configure git to auto-convert line endings
git config core.autocrlf false
git config core.eol lf

# Re-checkout the file
git rm --cached wait-for-it.sh
git checkout wait-for-it.sh
```

**Option C: Using Command Line**
```bash
# Windows (using PowerShell)
(Get-Content .\wait-for-it.sh -Raw) -replace "`r`n", "`n" | Set-Content .\wait-for-it.sh -NoNewline

# Windows (using WSL/Git Bash)
dos2unix wait-for-it.sh

# Linux/Mac
sed -i 's/\r$//' wait-for-it.sh
```

#### **Step 4: Clear Previous Migrations (Important!)**
```bash
# Remove existing migration files if any
rm -rf prisma/migrations

# This ensures clean migration setup
```

#### **Step 5: Initialize Database Migration**
```bash
# Create new migration from schema
npx prisma migrate dev --name init

# This creates migration files in prisma/migrations/
```

#### **Step 6: Deploy with Docker**
```bash
# Build and start all services
docker compose -f compose.yml up --build

# Or using docker-compose (older version)
docker-compose up --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f app
```

#### **Step 7: Verify Deployment**
```bash
# Test API health
curl http://localhost:3000/

# Expected response:
# {
#   "statusCode": 200,
#   "message": "Welcome to the API",
#   "data": null
# }
```

### **Method 2: Local Development**

#### **Prerequisites**
- Node.js (v18+)
- PostgreSQL
- RabbitMQ

#### **Setup**
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your local database credentials

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Start development server
npm run dev
```

## 🔧 **Environment Configuration**

### **Required Environment Variables**

Copy `.env.example` to `.env` and update the following:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# Email Service (Gmail)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-16-char-app-password"

# DOKU Payment Gateway
DOKU_BASE_URL="https://api-sandbox.doku.com"
DOKU_CLIENT_ID="BRN-0241-1729049974049"
DOKU_SECRET_KEY="SK-your-secret-key"

# RabbitMQ
RABBITMQ_URL="amqp://username:password@localhost:5672"
```

## 🧪 **API Testing Guide**

### **Authentication**

#### **1. Admin Login**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin1@gmail.com",
    "password": "passwordadmin1"
  }'
```

#### **2. Patient Login**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient1@gmail.com",
    "password": "passwordpatient1"
  }'
```

#### **3. Doctor Login**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor1@gmail.com",
    "password": "passworddoctor1"
  }'
```

### **Patient Management (Admin Only)**

#### **4. Create New Patient**
```bash
# First, get admin token from login
curl -X POST http://localhost:3000/api/v1/patients/addPatient \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "newpatient@gmail.com",
    "password": "securepassword123",
    "name": "John Doe",
    "age": 30,
    "gender": "MALE"
  }'
```

#### **5. Get All Patients**
```bash
curl -X GET http://localhost:3000/api/v1/patients/getAllPatients \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### **Scheduling System**

#### **6. Create Appointment**
```bash
curl -X POST http://localhost:3000/api/v1/scheduling/addSchedule \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PATIENT_TOKEN" \
  -d '{
    "patient_id": "P12345678901234",
    "doctor_id": "D12345678901234",
    "date": "2024-01-15T10:00:00.000Z",
    "price": 150000
  }'
```

#### **7. Update Appointment Status**
```bash
curl -X PUT http://localhost:3000/api/v1/scheduling/editSchedule/SCHEDULE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_DOCTOR_TOKEN" \
  -d '{
    "status": "COMPLETED"
  }'
```

### **Medical Records (Doctor/Admin)**

#### **8. Create Medical Record**
```bash
curl -X POST http://localhost:3000/api/v1/medical_records/addMedicalRecord \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_DOCTOR_TOKEN" \
  -d '{
    "patient_id": "P12345678901234",
    "doctor_id": "D12345678901234",
    "diagnosis": "Common Cold",
    "treatment": "Rest and medication",
    "medicine_name": "Paracetamol",
    "quantity": 10,
    "notes": "Take 3 times daily after meals"
  }'
```

### **Payment System**

#### **9. Generate Billing**
```bash
curl -X POST http://localhost:3000/api/v1/billing/generate/scheduling/SCHEDULE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### **10. Test DOKU Payment**
```bash
curl -X POST http://localhost:3000/api/v1/payments/test-doku-standalone \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 20000,
    "invoice_number": "TEST-INV-001"
  }'
```

### **Medicine Management (Admin)**

#### **11. Add Medicine**
```bash
curl -X POST http://localhost:3000/api/v1/medicines/addMedicine \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "medicine_name": "Amoxicillin",
    "stock": 100,
    "price": "25000"
  }'
```

#### **12. Get All Medicines**
```bash
curl -X GET http://localhost:3000/api/v1/medicines/getAllMedicines \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 🔔 **Notification System**

The system automatically sends email notifications for:

- ✅ **Schedule Created** - Confirmation to patient and doctor
- ✅ **Schedule Updated** - Status changes to both parties
- ✅ **Auto-generated billing** - Payment links via email

**RabbitMQ Management UI:** http://localhost:15672
- Username: `dzcarebytes_admin`
- Password: `dzcarebytes_rabbitmq_password_2024`

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **1. Line Ending Error (Windows)**
```bash
Error: /usr/bin/env: 'bash\r': No such file or directory
```
**Solution:** Fix line endings in `wait-for-it.sh` (see Step 3 above)

#### **2. Migration Errors**
```bash
Error: The table `public.User` does not exist
```
**Solution:**
```bash
# Remove old migrations and recreate
rm -rf prisma/migrations
npx prisma migrate dev --name init
```

#### **3. Docker Build Fails**
```bash
# Clean Docker cache
docker system prune -a
docker-compose down -v
docker-compose build --no-cache
```

#### **4. RabbitMQ Connection Issues**
```bash
# Check RabbitMQ status
docker-compose logs rabbitmq

# Restart RabbitMQ service
docker-compose restart rabbitmq
```

#### **5. Database Connection Issues**
```bash
# Check database status
docker-compose logs db

# Reset database volume
docker-compose down -v
docker-compose up --build
```

### **Useful Commands**

```bash
# View all running containers
docker-compose ps

# View logs for specific service
docker-compose logs -f app
docker-compose logs -f notification-worker

# Execute commands in container
docker-compose exec app npx prisma studio
docker-compose exec db psql -U dzcarebytes_user -d dzcarebytes_production_db

# Stop all services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v

# Scale notification workers
docker-compose up -d --scale notification-worker=2
```

## 📊 **Service Endpoints**

| Service | Port | Description |
|---------|------|-------------|
| API Server | 3000 | Main application |
| PostgreSQL | 5432 | Database |
| RabbitMQ | 5672 | Message queue |
| RabbitMQ Management | 15672 | Web UI |

## 🚀 **Production Deployment**

For production deployment, update the following:

1. **Security**: Change all default passwords
2. **SSL**: Add HTTPS certificates
3. **Environment**: Set `NODE_ENV=production`
4. **Monitoring**: Add logging and monitoring tools
5. **Backup**: Set up database backup strategy

## 📝 **License**

This project is developed for educational purposes as part of the Service-Oriented Architecture course.

## 👥 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Coding! 🚀**

For questions or issues, please refer to the troubleshooting section above or contact the development team.