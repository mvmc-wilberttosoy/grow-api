const User = require('../models/User');
const mongoose = require('mongoose');

// Services
const UniformService = require('../services/uniform.service');

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