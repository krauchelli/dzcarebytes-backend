# DzCareBytes 🏥

**DzCareBytes** is a modular backend system for hospital management, built with **Express.js**, **Prisma ORM**, and **PostgreSQL**. This project is part of the final assignment for the *Service-Oriented Architecture* course.

## 🔧 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JavaScript (ES6)
- RESTful API

## 📁 Project Structure
```
src/
├── app.js # Express app setup
├── server.js # Entry point
├── routes/ # Central route definitions
├── modules/ # Feature-based route logic
├── middlewares/ # Error and request handling
prisma/
├── schema.prisma # Prisma DB schema
```

## 🚀 Getting Started

1. Clone the repo
2. Install dependencies:
```bash
npm install
```
3. Setup your .env file
4. Generate Prisma client:
```bash
npx prisma generate
```
Run the server:
```bash
npm run dev
```
Database Migration:
```bash
npx prisma migrate dev --name init
```
Database Seeder:
```bash
npx prisma db seed
```
