const CompanyId = require('../models/CompanyId');

const mongooseUtilities = require('../utilities/mongoose.utilities');

const getEmployeesCompanyIds = async (req, res, next) => {
    try {
        const companyIds = await CompanyId.find({}).populate({
            path: 'employeeId',
            select: 'firstName lastName position departmentId -_id',
            populate: [
                { path: 'departmentId', select: 'name -_id'}
            ]
        })
        return res.status(200).json(companyIds);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getEmployeesCompanyIds
}