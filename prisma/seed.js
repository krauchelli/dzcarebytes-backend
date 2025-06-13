const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { generateIdWithPrefix } = require("../src/helper/idHelper");
const prisma = new PrismaClient();

async function main() {
  // Seed Admins
  for (let i = 1; i <= 3; i++) {
    await prisma.user.create({
      data: {
        id: generateIdWithPrefix("A"),
        role: "ADMIN",
        email: `admin${i}@gmail.com`,
        password: await bcrypt.hash(`passwordadmin${i}`, 10),
        name: `Admin${i}`,
        age: 25 + i,
        gender: i % 2 === 0 ? "MALE" : "FEMALE",
      },
    });
  }

  // Seed Doctor
  for (let i = 1; i <= 8; i++) {
    await prisma.user.create({
      data: {
        id: generateIdWithPrefix("D"),
        role: "DOCTOR",
        email: `doctor${i}@gmail.com`,
        password: await bcrypt.hash(`passworddoctor${i}`, 10),
        name: `Doctor${i}`,
        age: 30 + i,
        gender: i % 2 === 0 ? "MALE" : "FEMALE",
      },
    });
  }

  // Seed Patient
  for (let i = 1; i <= 15; i++) {
    await prisma.user.create({
      data: {
        id: generateIdWithPrefix("P"),
        role: "PATIENT",
        email: `patient${i}@gmail.com`,
        password: await bcrypt.hash(`passwordpatient${i}`, 10),
        name: `Patient${i}`,
        age: 20 + i,
        gender: i % 2 === 0 ? "MALE" : "FEMALE",
      },
    });
  }

  const medicineNames = [
    "Paracetamol",
    "Amoxicillin",
    "Ibuprofen",
    "Cetirizine",
    "Loperamide",
    "Omeprazole",
    "Ciprofloxacin",
    "Amlodipine",
    "Metformin",
    "Salbutamol",
  ];

  for (const name of medicineNames) {
    await prisma.pharmacy.create({
      data: {
        medicine_name: name,
        stock: Math.floor(Math.random() * 100) + 10,
        price: (Math.random() * 5000).toFixed(0),
      },
    });
  }
}

main().then(() => {
  console.log("Seeding successfully!");
  prisma.$disconnect();
  process.exit(1);
});
