const User = require('../models/User');
const bcrypt = require('bcrypt');

// Services
const companyIdServices = require('./companyId.service');
const uniformServices = require('./uniform.service');
const metrobankServices = require('./metrobank.service');
const touchpointServices = require('./touchpoint.service');

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

        if (newUser[0].role == 'User' && newUser[0].isOldEmployee === false) {
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
        const employees = await User.find({ role: 'User' }).populate('departmentId', 'name');
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


const updateUserDefaultPassword = async (employeeId, newPassword, session) => {
    try {
        // Validate that the employeeId is a valid ObjectId.
        mongooseUtilities.validateObjectId(employeeId);

        // Ensure the user exists.
        await mongooseUtilities.validateUserExistanceById(employeeId);
    
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedEmployee = await User.findByIdAndUpdate(
            employeeId,
            { $set: { password: hashedPassword, isDefaultPassword: false } },
            { returnDocument: 'after', session }
        );

        if (!updatedEmployee) {
            throw new CustomError('Update unsuccessful', 400);
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    createNewUser,
    getEmployees,
    deleteUserById,
    updateUserDefaultPassword
};