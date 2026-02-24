const User = require('../models/User');
const bcrypt = require('bcrypt');

// Services
const companyIdServices = require('../services/companyId.services');
const uniformServices = require('../services/uniform.services');
const metrobankServices = require('../services/metrobank.services');
const touchpointServices = require('../services/touchpoint.services');

// Utilities
const generalUtilities = require('../utilities/general.utilities');
const mongooseUtilities = require('../utilities/mongoose.utilities');
const CustomError = require('../utilities/error.utilities');

// Create new user service
const createNewUser = async (reqBody, session, next) => {
    try {
        const { divisionId, departmentId, email } = reqBody;

        // Validate all required fields.
        const requiredFields = [
            'firstName',
            'lastName',
            'birthday',
            'address',
            'email',
            'contactNumber',
            'divisionId',
            'departmentId',
            'position',
            'startDate'
        ];
        generalUtilities.validateRequiredFields(reqBody, requiredFields);

        // Validate divisionId and departmentId as valid ObjectIds.
        mongooseUtilities.validateObjectId(divisionId);
        mongooseUtilities.validateObjectId(departmentId);

        // Ensure user does not already exist by email.
        await mongooseUtilities.validateUserExistanceByEmail(email);

        // Validate divsion and department existence.
        await mongooseUtilities.validateDivisionExistenceById(divisionId);
        await mongooseUtilities.validateDepartmentExistenceById(departmentId);

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
        throw error;
    }
};


const getEmployees = async () => {
    try {
        const employees = await User.find({ role: 'User' });
        if (employees.length === 0) {
            throw new CustomError('No current employees', 404);
        }

        return employees;
    } catch (error) {
        throw error;
    }
}


const deleteUserById = async (employeeId, session) => {
    try {
        // Validate that the employeeId is a valid ObjectId.
        mongooseUtilities.validateObjectId(employeeId);

        // Ensure the user exists before deleting.
        await mongooseUtilities.validateUserExistanceById(employeeId);

        const deletedEmployee = await User.findByIdAndDelete(employeeId, { session });
        if (!deletedEmployee) {
            throw new CustomError('Employee not found', 404);
        }

        await companyIdServices.deleteCompanyId(employeeId, session);
        await uniformServices.deleteUniform(employeeId, session);
        await metrobankServices.deleteMetrobank(employeeId, session);
        await touchpointServices.deleteTouchpoints(employeeId, session)
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createNewUser,
    getEmployees,
    deleteUserById
};