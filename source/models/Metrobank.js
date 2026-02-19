const mongoose = require('mongoose');

const metrobankSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        frontImage: {
            url: { type: String },
            publicId: { type: String }
        },
        backImage: {
            url: { type: String },
            publicId: { type: String }
        },
        signatureSpecime: {
            url: { type: String },
            publicId: { type: String }
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

module.exports = mongoose.model('Metrobank', metrobankSchema);