const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Division', divisionSchema);