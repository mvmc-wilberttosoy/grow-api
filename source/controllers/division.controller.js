const mongoose = require('mongoose');
const Division = require('../models/Division');


// Create new division
const createNewDivision = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const IsExisting = await Division.findOne({ name });
        if (IsExisting) {
            return res.status(400).json({ message: 'Division already exist' });
        };

        const newDivision = await Division.create(
            {
                name,
                description
            }
        );

        if (!newDivision) {
            return res.status(400).json({ message: 'Division creation failed' });
        }

        return res.status(201).json({ message: 'New division created' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

// Get all divisions
const getDivisions = async (req, res) => {
    try {
        const divisions = await Division.find({});
        if (divisions.length == 0) {
            return res.status(400).json({ message: 'No divisions yet' });
        }

        return res.status(200).json(divisions);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

const getDivisionById = async (req, res) => {
    try {
        const { divisionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(divisionId)) {
            return res.status(400).json({ message: 'Invalid division ID format' });
        }

        const division = await Division.findById(divisionId);

        if (!division) {
            return res.status(404).json({ message: 'Division not found' });
        }

        return res.status(200).json(division);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = {
    createNewDivision,
    getDivisions,
    getDivisionById
};