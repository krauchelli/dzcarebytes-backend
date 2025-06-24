const prisma = require("../../config/prismaClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser = async (loginData) => {
    const { email, password } = loginData;

    if (!email || !password) {
        const error = new Error("Email and password are required");
        error.status = 400;
        throw error;
    }

    // 1. Find user by email
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    // 2. Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    // 3. Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return token;
};

module.exports = { loginUser };

