const prisma = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");
const { generateIdWithPrefix } = require("../../helper/idHelper");

// --------------------- DOCTOR ---------------------
const getAllDoctors = async () => {
    return prisma.user.findMany({ where: { role: "DOCTOR" } });
    };

    const getDoctorById = async (id) => {
    const doctorId = id;

    if (!doctorId) {
        const error = new Error("Invalid doctor ID format");
        error.status = 400;
        throw error;
    }

    return prisma.user.findUnique({ where: { id: doctorId } });
};

const createDoctor = async (doctorData) => {
    const id = generateIdWithPrefix("D");

    const { email, password, name, age, gender } = doctorData;

    if (!email || !password || !name || !age || !gender) {
        const error = new Error(
        "Missing required fields: email, password, name, age, gender"
        );
        error.status = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
        id,
        role: "DOCTOR",
        email,
        password: hashedPassword,
        name,
        age: parseInt(age, 10),
        gender,
        },
    });
};

const updateDoctor = async (id, doctorData) => {
    const doctorId = id;

    if (!doctorId) {
        const error = new Error("Invalid admin ID format");
        error.status = 400;
        throw error;
    }

    try {
        return prisma.user.update({
        where: { id: doctorId },
        data: {
            ...doctorData,
            ...(doctorData.age && { age: parseInt(doctorData.age, 10) }),
        },
        });
    } catch (error) {
        if (error.code === "P2025") {
        return null;
        }
        throw error;
    }
};

const deleteDoctor = async (id) => {
    const doctorId = id;

    if (!doctorId) {
        const error = new Error("Invalid doctor ID format");
        error.status = 400;
        throw error;
    }

    try {
        return prisma.user.delete({
        where: { id: doctorId },
        });
    } catch (error) {
        if (error.code === "P2025") {
        return null;
        }
        throw error;
    }
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
};