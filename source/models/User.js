const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        middleName: {
            type: String,
        },
        lastName: {
            type: String,
            required: true
        },
        birthday: {
            type: Date,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        isDefaultPassword: {
            type: Boolean,
            required: true,
            default: true
        },
        contactNumber: {
            type: String,
            required: true
        },
        divisionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Division',
            required: true
        },
        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: true
        },
        position: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: 'Active'
        },
        level: {
            type: String,
            required: true,
            enum: ['Staff', 'Supervisor', 'Manager'],
            default: 'Staff'
        },
        role: {
            type: String,
            required: true,
            enum: ['User', 'HR', 'Admin'],
            default: 'User'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema);