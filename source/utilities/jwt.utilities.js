const jwt = require('jsonwebtoken');

// Generate Access Tokens
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    );
};

// Generate Refresh Tokens
const generateRefreshToken = (user) => {
    return jwt.sign(
        { 
            id: user._id 
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

