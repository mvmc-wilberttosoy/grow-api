const Metrobank = require('../models/Metrobank');
const CustomError = require('../utilities/error.utilities');

const getMetrobanks = async (req, res, next) => {
    try {
        const metrobanks = await Metrobank.find({})
            .populate({
                path: 'employeeId',
                select: 'firstName lastName position departmentId -_id',
                populate: [
                    { path: 'departmentId', select: 'name -_id'}
                ]
            });
        
        if (metrobanks.length === 0) {
            throw new CustomError('No metrobanks yet', 404);
        };

        return res.status(200).json(metrobanks);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getMetrobanks
}
