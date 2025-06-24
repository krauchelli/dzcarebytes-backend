const prisma = require("../../config/prismaClient");

// --------------------- MEDICINE ---------------------
const getAllMedicines = async () => {
    return prisma.pharmacy.findMany();
};

const getMedicineByName = async (name) => {
    const medicineName = name;

    if (!medicineName) {
        const error = new Error("Invalid Medicine Name");
        error.status = 400;
        throw error;
    }

    return prisma.pharmacy.findUnique({ where: { medicine_name: medicineName } });
};

const addMedicine = async (medicineData) => {
    const { medicine_name, stock, price } = medicineData;

    if (!medicine_name || !stock || !price) {
        const error = new Error(
        "Missing required fields: medicine_name, stock, price"
        );
        error.status = 400;
        throw error;
    }

    return prisma.pharmacy.create({
        data: {
        medicine_name,
        stock: parseInt(stock, 10),
        price: parseInt(price, 10),
        },
    });
};

const updateMedicine = async (name, medicineData) => {
    const medicineName = name;

    if (!medicineName) {
        const error = new Error("Invalid Medicine Name");
        error.status = 400;
        throw error;
    }

    try {
        return prisma.pharmacy.update({
        where: { medicine_name: medicineName },
        data: {
            ...medicineData,
            ...(medicineData.stock && { stock: parseInt(medicineData.stock, 10) }),
            ...(medicineData.price && { price: parseInt(medicineData.price, 10) }),
        },
        });
    } catch (error) {
        if (error.code === "P2025") {
        return null;
        }
        throw error;
    }
    };

    const deleteMedicine = async (name) => {
    const medicineName = name;

    if (!medicineName) {
        const error = new Error("Invalid medicine name");
        error.status = 400;
        throw error;
    }

    try {
        return prisma.pharmacy.delete({
        where: { medicine_name: medicineName },
        });
    } catch (error) {
        if (error.code === "P2025") {
        return null;
        }
        throw error;
    }
};

module.exports = {
    getAllMedicines,
    getMedicineByName,
    addMedicine,
    updateMedicine,
    deleteMedicine,
};