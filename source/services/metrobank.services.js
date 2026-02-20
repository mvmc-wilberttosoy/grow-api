const Metrobank = require('../models/Metrobank');
const CustomError = require('../utilities/error.utilities');

const createMetrobank = async (employeeId, session) => {
    try {
        await Metrobank.create(
            [
                {
                    employeeId: employeeId,
                    frontImage: { url: null, publicId: null },
                    backImage: { url: null, publicId: null },
                    signatureSpecimen: { url: null, publicId: null }
                }
            ],
            { session }
        );
    } catch (error) {
        throw new CustomError('Metrobank creation failed', 400);
    }
}

const deleteMetrobank = async (employeeId, session) => {
    try {
        const deletedMetrobank = await Metrobank.deleteOne({ employeeId: employeeId }, { session });
        if (!deletedMetrobank) {
            throw new CustomError('Metrobank not found', 404);
        }
    } catch (error) {
        throw new CustomError('Metrobank deletion failed', 400);
    }
}

module.exports = {
    createMetrobank,
    deleteMetrobank
}