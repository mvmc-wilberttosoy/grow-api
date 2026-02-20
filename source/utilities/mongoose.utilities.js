const mongoose = require('mongoose');
const User = require('../models/User');
const Division = require('../models/Division');
const Department = require('../models/Department');
const CustomError = require('../utilities/error.utilities');

const startTransaction = async () => {
    const session = await mongoose.startSession();
    session.startTransaction();
    return session;
};

const commitTransaction = async (session) => {
    await session.commitTransaction();
    session.endSession();
};

const abortTransaction = async (session) => {
    await session.abortTransaction();
    session.endSession();
};

const validateObjectId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomError('Invalid ID format', 400);
    }
}

// Users
const validateUserExistanceByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (user) {
        throw new CustomError('User already exists', 400);
    };
}

const validateUserExistanceById = async (employeeId) => {
    const user = await User.findById(employeeId);
    if (!user) {
        throw new CustomError('User does not exists', 404);
    };
}

// Divisions
const validateDivisionExistenceById = async (divisionId) => {
    const division = await Division.findById(divisionId);
    if (!division) {
        throw new CustomError('Division not found', 404);
    }
}

// Departments
const validateDepartmentExistenceById = async (departmentId) => {
    const department = await Department.findById(departmentId);
    if (!department) {
        throw new CustomError('Department not found', 404);
    };
};

module.exports = { 
    startTransaction, 
    commitTransaction, 
    abortTransaction,
    validateObjectId,
    validateUserExistanceByEmail,
    validateUserExistanceById,
    validateDivisionExistenceById,
    validateDepartmentExistenceById
};