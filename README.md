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

#### **Step 3: Clear Previous Migrations (Important!)**
```bash
# Remove existing migration files if any
rm -rf prisma/migrations

# This ensures clean migration setup
```

#### **Step 4: Initialize Database Migration**
```bash
# Create new migration from schema
npx prisma migrate dev --name init

# This creates migration files in prisma/migrations/
```

#### **Step 5: Deploy with Docker**
```bash
# Build and start all services
docker compose -f compose.yml up --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f app
```

#### **Step 6: Verify Deployment**
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