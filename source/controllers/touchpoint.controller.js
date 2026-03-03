const Touchpoint = require('../models/Touchpoints');

const touchpointServices = require('../services/touchpoint.service');

const mongooseUtilities = require('../utilities/mongoose.utilities');

const getUserTouchpointByUserId = async (req, res, next) => {
    try {
        const employeeId = req.params.employeeId;

        mongooseUtilities.validateObjectId(employeeId);
        await mongooseUtilities.validateUserExistanceById(employeeId);

        const touchpoints = await touchpointServices.getUserTouchpoints(employeeId);

        return res.status(200).json(touchpoints);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUserTouchpointByUserId 
}