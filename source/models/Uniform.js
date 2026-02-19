const mongoose = require('mongoose');

const uniformSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isOnsiteChoosing: {
            type: Boolean,
            default: false,
        },
        topSize: {
            type: String,
        },
        bottomSize: {
            type: String
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

module.exports = mongoose.model('Uniform', uniformSchema);