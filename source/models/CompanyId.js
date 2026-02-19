const mongoose = require('mongoose');

const companyIdSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        picture: {
            url: {
                type: String
            },
            publicId: {
                type: String
            }
        },
        emergencyContactName: {
            type: String,
        },
        emergencyContactAddress: {
            type: String,
        },
        emergencyContactNumber: {
            type: String,
        },
        status: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('CompanyId', companyIdSchema);