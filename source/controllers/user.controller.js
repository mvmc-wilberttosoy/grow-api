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


const deleteEmployeeById = async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const deletedEmployee = await User.findByIdAndDelete(employeeId);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.status(200).json({ message: 'Employee deleted successfully '});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
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