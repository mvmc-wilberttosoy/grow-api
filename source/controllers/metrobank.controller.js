const Metrobank = require('../models/Metrobank');
const CustomError = require('../utilities/error.utilities');

const getMetrobanks = async (req, res, next) => {
    try {
        const metrobanks = await Metrobank.find({})
            .populate({
                path: 'employeeId',
                select: 'firstName lastName position departmentId -_id',
                populate: [
                    { path: 'departmentId', select: 'name -_id' }
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

const getMetrobank = async (req, res, next) => {
    try {
        const { id } = req.params;

        const metrobank = await Metrobank.findById(id).populate({
            path: 'employeeId',
            select: 'firstName lastName position departmentId -_id',
            populate: [
                { path: 'departmentId', select: 'name -_id' }
            ]
        })
        return res.status(200).json(metrobank);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getMetrobanks,
    getMetrobank
}
