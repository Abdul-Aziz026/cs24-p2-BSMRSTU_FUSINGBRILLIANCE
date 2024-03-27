const mongoose = require('mongoose');

// Define schema for STS
const STSSchema = new mongoose.Schema({
    sts_id: mongoose.Schema.Types.ObjectId,
    ward_no: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    gps_location: {
        type: {
            x: Number,
            y: Number
        },
        required: true
    },
    sts_mgr_id: {
        type: String,
        default: null
    },
});

// Create a Mongoose model
const STS = mongoose.model('STS', STSSchema);

module.exports = STS;