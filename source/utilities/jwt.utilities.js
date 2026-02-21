const jwt = require('jsonwebtoken');

// Generate Access Tokens
const generateAccessToken = (userId, role) => {
    return jwt.sign(
        {
            sub: userId,
            role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    );
};

// Generate Refresh Tokens
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { 
            sub:userId 
        },
        process.env.JWT_REFRESH_SECRET,
        { 
            expiresIn: '1d' 
        }
    );
};

// Verify Access Token
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Verify Refresh Token
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};

