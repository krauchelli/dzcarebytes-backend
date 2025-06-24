const authService = require("./auth.service");

const login = async (req, res, next) => {
    try {
        const token = await authService.loginUser(req.body);
        res.status(200).json({
            statusCode: 200,
            message: "Login successful",
            data: {
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { login };

