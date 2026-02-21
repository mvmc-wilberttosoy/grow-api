const User = require('../models/User');
const bcrypt = require('bcrypt');

const jwtUtilities = require('../utilities/jwt.utilities');
const CustomError = require('../utilities/error.utilities');


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwtUtilities.generateAccessToken(user._id, user.role);
        const refreshToken = jwtUtilities.generateRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });

        return res.status(200).json({
            accessToken,
            message: 'Logged in successfully'
        });
    } catch (error) {
        throw new CustomError('Login failed', 400);
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        // console.log(req.cookies.refreshToken);
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const decoded = jwtUtilities.verifyRefreshToken(refreshToken);
        console.log(decoded)
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        const accessToken = jwtUtilities.generateAccessToken(decoded.userId);
        return res.status(200).json({ accessToken });
    } catch (error) {
        throw new CustomError('Error refreshing token', 400);
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log(error);
        throw new CustomError('Error loggint out', 400);
    }
}

module.exports = {
    login,
    refreshAccessToken,
    logout
}