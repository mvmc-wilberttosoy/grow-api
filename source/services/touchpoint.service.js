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

module.exports = {
    createTouchpoints,
    deleteTouchpoints,
};