const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { generateIdWithPrefix } = require("../src/helper/idHelper");

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('👨‍💼 Creating admins...');
  
  // Seed Admins
  const adminPromises = [];
  for (let i = 1; i <= 3; i++) {
    adminPromises.push(
      prisma.user.create({
        data: {
          id: generateIdWithPrefix("A"),
          role: "ADMIN",
          email: `admin${i}@gmail.com`,
          password: await bcrypt.hash(`passwordadmin${i}`, 10),
          name: `Admin${i}`,
          age: 25 + i,
          gender: i % 2 === 0 ? "MALE" : "FEMALE",
        },
      })
    );
  }
  await Promise.all(adminPromises);
  console.log('✅ 3 admins created');

  console.log('👨‍⚕️ Creating doctors...');
  
  // Seed Doctors
  const doctorPromises = [];
  for (let i = 1; i <= 8; i++) {
    doctorPromises.push(
      prisma.user.create({
        data: {
          id: generateIdWithPrefix("D"),
          role: "DOCTOR",
          email: `doctor${i}@gmail.com`,
          password: await bcrypt.hash(`passworddoctor${i}`, 10),
          name: `Doctor${i}`,
          age: 30 + i,
          gender: i % 2 === 0 ? "MALE" : "FEMALE",
        },
      })
    );
  }
  await Promise.all(doctorPromises);
  console.log('✅ 8 doctors created');

  console.log('🧑‍🤝‍🧑 Creating patients...');
  
  // Seed Patients
  const patientPromises = [];
  for (let i = 1; i <= 15; i++) {
    patientPromises.push(
      prisma.user.create({
        data: {
          id: generateIdWithPrefix("P"),
          role: "PATIENT",
          email: `patient${i}@gmail.com`,
          password: await bcrypt.hash(`passwordpatient${i}`, 10),
          name: `Patient${i}`,
          age: 20 + i,
          gender: i % 2 === 0 ? "MALE" : "FEMALE",
        },
      })
    );
  }
  await Promise.all(patientPromises);
  console.log('✅ 15 patients created');
}

async function seedMedicines() {
  console.log('💊 Creating medicines...');
  
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

  const medicinePromises = medicineNames.map(name =>
    prisma.pharmacy.upsert({
      where: { medicine_name: name },
      update: {}, // Don't update if exists
      create: {
        medicine_name: name,
        stock: Math.floor(Math.random() * 100) + 10,
        price: (Math.random() * 5000).toFixed(0),
      },
    })
  );

  await Promise.all(medicinePromises);
  console.log(`✅ ${medicineNames.length} medicines created/updated`);
}

async function main() {
  console.log('🌱 Starting database seeding...');
  
  try {
    await seedUsers();
    await seedMedicines();
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// 🚀 Main execution with proper error handling
(async () => {
  try {
    await main();
    console.log("✅ Seeding successfully completed!");
  } catch (error) {
    console.error("💥 Seeding failed:", error);
    process.exitCode = 1; // Set exit code but don't exit immediately
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
    // Let Node.js exit naturally with the set exit code
  }
})();