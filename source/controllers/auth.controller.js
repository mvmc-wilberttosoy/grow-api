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

        const accessToken = jwtUtilities.generateAccessToken(user);
        const refreshToken = jwtUtilities.generateRefreshToken(user);

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });

        const isDefaultPassword = user.isDefaultPassword;
        return res.status(200).json({ 
            success: true,
            message: 'Logged in successfully',
            isDefaultPassword,
            accessToken
        });
    } catch (error) {
        throw new CustomError('Login failed', 400);
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        const cookies = req.cookies.jwt;

        // console.log(req.cookies.refreshToken);
        if (!cookies) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const decoded = jwtUtilities.verifyRefreshToken(cookies);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        const accessToken = jwtUtilities.generateAccessToken(decoded.id);
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