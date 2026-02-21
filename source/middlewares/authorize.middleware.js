const CustomError = require('../utilities/error.utilities');

const authorize = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (!roles.includes(userRole)) {
            throw new CustomError('Access denied: Insufficient permissions', 403);
        }

        next();
    }
};

module.exports = authorize;