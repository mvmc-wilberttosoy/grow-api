const Department = require('../models/Department');
const Division = require('../models/Division');
const mongoose = require('mongoose');

// Create new department
const createNewDepartment = async (req, res) => {
    const { name, description, divisionId } = req.body;
    try {
        if (!name || !divisionId) {
            return res.status(400).json({ message: 'Provide all necessary fields' });
        }

        if (!mongoose.Types.ObjectId.isValid(divisionId)) {
            return res.status(400).json({ message: 'Invalid Division Id format' });
        }

        const division = await Division.findById(divisionId);
        if (!division) {
            return res.status(404).json({ message: 'Division not found' });
        }

        const newDepartment = await Department.create(
            {
                name,
                description,
                divisionId
            }
        )

        if (!newDepartment) {
            return res.status(400).json({ message: 'Department creation failed' });
        }

        return res.status(201).json({ message: 'New Department Created' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}


// Get all departments
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({});
        if (departments.length == 0) {
            return res.status(400).json({ message: 'No departments yet' });
        }

        return res.status(200).json(departments);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

// Get deparment by departmentId and divisionId
const getDepartmentByDivisionIdAndId = async (req, res) => {
    try {
        const { divisionId, departmentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(divisionId) || !mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const department = await Department.findOne(
            {
                _id: departmentId,
                divisionId: divisionId
            }
        ).populate('divisionId');

        if (!department) {
            return res.status(404).json({ message: 'Department not found' })
        }

        return res.status(200).json(department);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}


const updateDepartmentByDivisionIdAndId = async (req, res) => {
    try {
        const { divisionId, departmentId } = req.params;
        const { name, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(divisionId) || !mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const updatedDepartment = await Department.findOneAndUpdate(
            { _id: departmentId, divisionId: divisionId },
            { name, description },
            { returnDocument: true }
        )

        if (!updatedDepartment) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        return res.status(200).json({ message: 'Department updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}


const deleteDepartmentByDivisionIdAndId = async (req, res) => {
    try {
        const { divisionId, departmentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(divisionId) || !mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const deletedDepartment = await Department.findOneAndDelete(
            {
                _id: departmentId,
                divisionId: divisionId
            }
        );

        if (!deletedDepartment) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        return res.status(200).json({ message: 'Department deleted successfully ' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    createNewDepartment,
    getDepartments,
    getDepartmentByDivisionIdAndId,
    updateDepartmentByDivisionIdAndId,
    deleteDepartmentByDivisionIdAndId
}
