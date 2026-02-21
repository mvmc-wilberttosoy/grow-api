const jwtUtilities = require('../utilities/jwt.utilities');
const CustomError = require('../utilities/error.utilities');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        throw new CustomError('No token provided, authorization denied', 401);
    };

    const decoded = jwtUtilities.verifyAccessToken(token);
    if (!decoded) {
        throw new CustomError('Invalid or expired token', 403);
    };

    req.user = decoded;
    next();
};

module.exports = authenticate;