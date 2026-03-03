const Touchpoint = require('../models/Touchpoints');
const CustomError = require('../utilities/error.utilities');

const createTouchpoints = async (employeeId, touchpoints, session) => {
    try {
        const touchpointData = touchpoints.map((touchpoint) => {
            const { date, time } = touchpoint.schedule;

            if (date && time) {
                const [hours, minutes] = time.split(':');

                const combinedDate = new Date(date);
                combinedDate.setHours(hours, minutes, 0, 0);

                return {
                    employeeId: employeeId,
                    approverId: touchpoint.approverId,
                    date: combinedDate
                };
            }

            return {
                employeeId: employeeId,
                approverId: touchpoint.approverId,
                date: new Date(date)
            };
        })

        await Touchpoint.insertMany(touchpointData, { session });
    } catch (error) {
        throw new CustomError('Touchpoint creation failed', 400);
    }
}

const deleteTouchpoints = async (employeeId, session) => {
    try {
        await Touchpoint.deleteMany({ employeeId: employeeId }, { session });
    } catch (error) {
        throw new CustomError('Touchpoint deletion failed', 400);
    }
}

const getUserTouchpoints = async (employeeId) => {
    try {
        const touchpoints = await Touchpoint.find({ employeeId: employeeId })
            .populate({
                path: 'approverId', // Populating the approverId field
                select: 'firstName lastName position divisionId departmentId', // Select relevant fields
                populate: [
                    { path: 'divisionId', select: 'name' },  // Populate divisionId with the name field
                    { path: 'departmentId', select: 'name' }  // Populate departmentId with the name field
                ]
            });

        if (touchpoints.length === 0) {
            throw new CustomError('Touchpoints not found', 404);
        }

        return touchpoints;
    } catch (error) {
        throw new CustomError('Touchpoints not found', 404);
    }
};

module.exports = {
    createTouchpoints,
    deleteTouchpoints,
    getUserTouchpoints
};