const User = require('../models/User');
const mongoose = require('mongoose');

// Services
const UniformService = require('../services/uniform.service');
const Uniform = require('../models/Uniform');

const updateUserUniform = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { topSize, bottomSize, isOnsiteChoosing } = req.body;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        const employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const updateData = {};

        if (isOnsiteChoosing === false) {
            updateData.topSize = topSize;
            updateData.bottomSize = bottomSize;
        }

        updateData.status = true;

        const updatedUniform = await Uniform.findOneAndUpdate(
            { employeeId: employeeId },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        
        if (!updatedUniform) {
            return res.status(404).json({ message: 'Uniform not found' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};

const getUniforms = async (req, res, next) => {
    try {
        const uniforms = await Uniform.find({}).populate({
            path: 'employeeId',
            select: 'firstName lastName position departmentId -_id',
            populate: [
                { path: 'departmentId', select: 'name -_id' }
            ]
        });

        return res.status(200).json(uniforms);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUniforms,
    updateUserUniform
}