const Uniform = require('../models/Uniform');
const CustomError = require('../utilities/error.utilities');

const createUniform = async (employeeId, session) => {
    try {
        await Uniform.create(
            [
                {
                    employeeId: employeeId,
                    topSize: null,
                    bottomSize: null
                }
            ],
            { session }
        );
    } catch (error) {
        throw new CustomError('Uniform creation failed', 400);
    }
}

const deleteUniform = async (employeeId, session) => {
    try {
        const deletedUniform = await Uniform.deleteOne({employeeId: employeeId}, { session });
        if (!deletedUniform) {
            throw new CustomError('Uniform not found', 404);
        }
        
    } catch (error) {
        throw new CustomError('Uniform deletion failed', 400);
    }
}

module.exports = {
    createUniform,
    deleteUniform
};