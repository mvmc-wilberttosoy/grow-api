const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        divisionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Division',
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Department', departmentSchema);