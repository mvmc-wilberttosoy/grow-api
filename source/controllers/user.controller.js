const User = require('../models/User');
const Division = require('../models/Division');
const Department = require('../models/Department');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const createNewUser = async (req, res) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            birthday,
            address,
            email,
            contactNumber,
            divisionId,
            departmentId,
            position,
            startDate,
            role
        } = req.body;

        if (!firstName || !lastName || !birthday || !address || !email || !contactNumber || !divisionId || !departmentId || !position || !startDate) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

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

        const hashedPassword = await bcrypt.hash('qwerty', 10);

        const newUser = await User.create(
            {
                firstName,
                middleName,
                lastName,
                birthday,
                address,
                email,
                password: hashedPassword,
                contactNumber,
                divisionId,
                departmentId,
                position,
                startDate,
                role
            }
        )

        if (!newUser) {
            return res.status(400).json({ message: 'User creation failed' });
        }

        return res.status(201).json({ message: 'New user created successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({}).select('-password');
        if (employees.length == 0) {
            return res.status(404).json({ message: 'No current employeess' });
        }

        return res.status(200).json(employees);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    createNewUser,
    getEmployees
}