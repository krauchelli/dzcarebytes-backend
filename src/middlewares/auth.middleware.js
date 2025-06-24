const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
        const error = new Error("Access token is required");
        error.status = 401; // Unauthorized
        return next(error);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            const error = new Error("Invalid or expired token");
            error.status = 403; // Forbidden
            return next(error);
        }
        req.user = user; // Attach user payload (id, role) to the request
        next();
    });
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            const error = new Error("Authentication error");
            error.status = 403;
            return next(error);
        }

        if (!allowedRoles.includes(req.user.role)) {
            const error = new Error("You do not have permission to perform this action");
            error.status = 403; // Forbidden
            return next(error);
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };

