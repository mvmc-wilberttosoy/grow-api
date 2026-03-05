const Touchpoint = require('../models/Touchpoints');
const User = require('../models/User');
const mongoose = require('mongoose');

const touchpointServices = require('../services/touchpoint.service');

const mongooseUtilities = require('../utilities/mongoose.utilities');

const getUserTouchpointByUserId = async (req, res, next) => {
    try {
        const employeeId = req.params.employeeId;

        mongooseUtilities.validateObjectId(employeeId);
        await mongooseUtilities.validateUserExistanceById(employeeId);

        const touchpoints = await touchpointServices.getUserTouchpoints(employeeId);

        return res.status(200).json(touchpoints);
    } catch (error) {
        next(error);
    }
}

const getAllTouchpoints = async (req, res, next) => {
    try {
        const touchpoints = await User.aggregate([
            {
                $match: { isOldEmployee: false }
            },
            {
                $lookup: {
                    from: 'touchpoints',
                    localField: '_id',
                    foreignField: 'employeeId',
                    as: 'touchpoints'
                }
            },
            {
                $lookup: {
                    from: 'departments',           // Name of the department collection
                    localField: 'departmentId',    // Field in the User model
                    foreignField: '_id',           // Field in the Department model
                    as: 'department'               // Store the department data in the 'department' field
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    position: 1,
                    touchpoints: {
                        $map: {
                            input: "$touchpoints", // Iterate over touchpoints
                            as: "touchpoint",
                            in: {
                                date: "$$touchpoint.date",  // Include only specific fields for touchpoints
                                isSigned: "$$touchpoint.isSigned",
                                status: "$$touchpoint.status",
                            }
                        }
                    },
                    departmentName: { $arrayElemAt: [{ $ifNull: ["$department.name", null] }, 0] }
                }
            }
        ]);

        return res.status(200).json(touchpoints);
    } catch (error) {
        next(error);
    }
};

const getUserTouchpoints = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const objectId = new mongoose.Types.ObjectId(id);

        const touchpoints = await User.aggregate([
            {
                $match: { _id: objectId }
            },
            {
                $lookup: {
                    from: 'touchpoints',
                    localField: '_id',
                    foreignField: 'employeeId',
                    as: 'touchpoints'
                }
            },
            {
                $lookup: {
                    from: 'departments',           // Name of the department collection
                    localField: 'departmentId',    // Field in the User model
                    foreignField: '_id',           // Field in the Department model
                    as: 'department'               // Store the department data in the 'department' field
                }
            }
        ])

        return res.status(200).json(touchpoints);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUserTouchpointByUserId,
    getAllTouchpoints,
    getUserTouchpoints
}