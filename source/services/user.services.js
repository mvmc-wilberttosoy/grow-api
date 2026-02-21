const User = require('../models/User');
const bcrypt = require('bcrypt');

// Services
const companyIdServices = require('../services/companyId.services');
const uniformServices = require('../services/uniform.services');
const metrobankServices = require('../services/metrobank.services');
const touchpointServices = require('../services/touchpoint.services');

// Utilities
const generalUtilities = require('../utilities/general.utilities');
const CustomError = require('../utilities/error.utilities');

// Create new user service
const createNewUser = async (reqBody, session) => {
    try {
        const password = generalUtilities.generateRandomPassword();
        const hashedPassword = await bcrypt.hash('123', 10);

        const newUser = await User.create(
            [
                {
                    ...reqBody,
                    password: hashedPassword
                }
            ],
            { session }
        );

        if (!newUser[0]) {
            throw new CustomError('User creation failed', 400);
        }

        if (newUser[0].role == 'User') {
            await companyIdServices.createCompanyId(newUser[0]._id, session);
            await uniformServices.createUniform(newUser[0]._id, session);
            await metrobankServices.createMetrobank(newUser[0]._id, session);
            await touchpointServices.createTouchpoints(newUser[0]._id, reqBody.touchpoints, session);
        }
    } catch (error) {
        throw new CustomError('User creation failed', 400);
    }
};


const deleteUserById = async (employeeId, session) => {
    try {
        const deletedEmployee = await User.findByIdAndDelete(employeeId, { session });
        if (!deletedEmployee) {
            throw new CustomError('Employee not found', 404);
        }

        await companyIdServices.deleteCompanyId(employeeId, session);
        await uniformServices.deleteUniform(employeeId, session);
        await metrobankServices.deleteMetrobank(employeeId, session);
        await touchpointServices.deleteTouchpoints(employeeId, session)
    } catch (error) {
        throw new CustomError('User deletion failed', 400);
    }
}

module.exports = {
    createNewUser,
    deleteUserById
};