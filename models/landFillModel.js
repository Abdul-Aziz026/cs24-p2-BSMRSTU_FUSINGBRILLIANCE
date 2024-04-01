const mongoose = require('mongoose');

// Define schema for STS
const LanSchema = new mongoose.Schema({
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
    creatTime:{
        type: Date,
        default: Date.now,
    },
    landfill_mgr_id: {
        type: String,
        default: null
    },
});

// Create a Mongoose model
const land = mongoose.model('land', LanSchema);

module.exports = land;