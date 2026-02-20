const Touchpoint = require('../models/Touchpoints');
const CustomError = require('../utilities/error.utilities');

const createTouchpoints = async (employeeId, touchpoints, session) => {
    try {
        const touchpointData = touchpoints.map((touchpoint) => ({
            employeeId: employeeId,
            approverId: touchpoint.approverId,
            date: touchpoint.date
        }));

        console.log(touchpointData);

        await Touchpoint.insertMany(touchpointData, { session });
    } catch (error) {
        throw new CustomError('Touchpoint creation failed', 400);
    }
}

const deleteTouchpoints = async (employeeId, session) => {
    try {
        console.log(employeeId);
        await Touchpoint.deleteMany({ employeeId: employeeId }, { session });
    } catch (error) {
        throw new CustomError('Touchpoint deletion failed', 400);
    }
}

module.exports = {
    createTouchpoints,
    deleteTouchpoints,
};