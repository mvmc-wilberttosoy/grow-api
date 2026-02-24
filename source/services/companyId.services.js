const CompanyId = require('../models/CompanyId');
const CustomError = require('../utilities/error.utilities');

const createCompanyId = async (employeeId, session) => {
    try {
        await CompanyId.create(
            [
                {
                    employeeId: employeeId,
                    picture: { url: null, publicId: null },
                    emergencyContactName: null,
                    emergencyContactAddress: null,
                    emergencyContactNumber: null
                }
            ],
            { session }
        );
    } catch (error) {
        throw new CustomError('Company ID creation failed', 400);
    }
};


const deleteCompanyId = async (employeeId, session) => {
    try {
        const deletedCompanyId = await CompanyId.deleteOne({ employeeId: employeeId }, { session });
        if (!deletedCompanyId) {
            throw new CustomError('Company ID not found', 404);
            
        }
    } catch (error) {
        throw new CustomError('Company ID deletion failed', 400);
    }
}


module.exports = {
    createCompanyId,
    deleteCompanyId
};