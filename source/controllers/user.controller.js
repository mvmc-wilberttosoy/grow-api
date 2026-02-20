const User = require('../models/User');
const Division = require('../models/Division');
const Department = require('../models/Department');
const CompanyId = require('../models/CompanyId');
const Uniform = require('../models/Uniform');
const Metrobank = require('../models/Metrobank');
const Touchpoint = require('../models/Touchpoints');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Services
const userServices = require('../services/user.services');

// Utilities
const generalUtilities = require('../utilities/general.utilities');
const mongooseUtilities = require('../utilities/mongoose.utilities');

// Asynchronous function to handle user creation.
const createNewUser = async (req, res, next) => {
    // Start a transaction to ensure atomicity.
    const session = await mongooseUtilities.startTransaction();

    try {
        const { divisionId, departmentId, email } = req.body;

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
        generalUtilities.validateRequiredFields(req.body, requiredFields);

        // Validate divisionId and departmentId as valid ObjectIds.
        mongooseUtilities.validateObjectId(divisionId);
        mongooseUtilities.validateObjectId(departmentId);

        // Ensure user does not already exist by email.
        await mongooseUtilities.validateUserExistanceByEmail(email);

        // Validate divsion and department existence.
        await mongooseUtilities.validateDivisionExistenceById(divisionId);
        await mongooseUtilities.validateDepartmentExistenceById(departmentId);

        // Create the new user.
        await userServices.createNewUser(req.body, session);

        // Commit transaction if successful.
        await mongooseUtilities.commitTransaction(session);

        // Respond with sucess message.
        return res.status(201).json({ message: 'New user created successfully' });
    } catch (error) {
        // Rollback transaction on error and pass to next middleware.
        await mongooseUtilities.abortTransaction(session);
        next(error);
    } finally {
        session.endSession();
    }
}


const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'User' }).select('-password');
        if (employees.length == 0) {
            return res.status(404).json({ message: 'No current employeess' });
        }

        return res.status(200).json(employees);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}


const getEmployeeById = async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid Employee ID' });
        }

        const employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee doesn\'t exists' });
        }

        return res.status(200).json(employee);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}


const getEmployeesByDivisionId = async (req, res) => {
    try {
        const { divisionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(divisionId)) {
            return res.status(400).json({ message: 'Invalid Division ID' });
        }

        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).json({ message: 'Division not found' });
        }

        const employees = await User.find({ divisionId: divisionId });
        if (!employees) {
            return res.status(404).json({ message: 'No employees yet' });
        }

        return res.status(200).json(employees);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}


const getEmployeesByDivisionIdAndDepartmentId = async (req, res) => {
    try {
        const { divisionId, departmentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(divisionId) || !mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).json({ message: 'Division not found' });
        }

        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const employees = await User.find({ divisionId: divisionId, departmentId: departmentId });
        if (!employees) {
            return res.status(404).json({ message: 'No employees yet' });
        }

        return res.status(200).json(employees);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}


const updateEmployeeById = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const {
            firstName,
            middleName,
            lastName,
            birthday,
            address,
            email,
            password,
            contactNumber,
            divisionId,
            departmentId,
            position,
            startDate,
            status
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        // Prepare the fields to be updated.
        const updatedFields = {};
        if (firstName) updatedFields.firstName = firstName;
        if (middleName) updatedFields.middleName = middleName;
        if (lastName) updatedFields.lastName = lastName;
        if (birthday) updatedFields.birthday = birthday;
        if (address) updatedFields.address = address;
        if (email) updatedFields.email = email;
        if (contactNumber) updatedFields.contactNumber = contactNumber;
        if (position) updatedFields.position = position;
        if (startDate) updatedFields.startDate = startDate;
        if (status) updatedFields.status = status;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedFields.password = hashedPassword;
        };

        if (divisionId) {
            if (!mongoose.Types.ObjectId.isValid(divisionId)) {
                return res.status(400).json({ message: 'Invalid Division ID format' });
            }

            const division = await Division.findById(divisionId);
            if (!division) {
                return res.status(404).json({ message: 'Divison not found' });
            }

            updatedFields.divisionId = divisionId;
        };

        if (departmentId) {
            if (!mongoose.Types.ObjectId.isValid(departmentId)) {
                return res.status(400).json({ message: 'Invalid Department ID format' });
            }

            const department = await Department.findById(departmentId);
            if (!department) {
                return res.status(404).json({ message: 'Department not found' });
            }

            updatedFields.departmentId = departmentId
        };


        // Perform the update
        const updatedEmployee = await User.findByIdAndUpdate(
            employeeId,
            { $set: updatedFields },
            { returnDocument: 'after' }
        );
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.status(200).json({ message: 'Update succesfull' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}


const deleteEmployeeById = async (req, res, next) => {

    const session = await mongooseUtilities.startTransaction();

    try {
        const { employeeId } = req.params;

        mongooseUtilities.validateObjectId(employeeId);
        await mongooseUtilities.validateUserExistanceById(employeeId);

        await userServices.deleteUserById(employeeId, session);

        await mongooseUtilities.commitTransaction(session);

        return res.status(200).json({ message: 'Employee and related data deleted successfully' });
    } catch (error) {
        await mongooseUtilities.abortTransaction(session);
        next(error);
    }
}

module.exports = {
    createNewUser,
    getEmployees,
    getEmployeeById,
    getEmployeesByDivisionId,
    getEmployeesByDivisionIdAndDepartmentId,
    updateEmployeeById,
    deleteEmployeeById
}