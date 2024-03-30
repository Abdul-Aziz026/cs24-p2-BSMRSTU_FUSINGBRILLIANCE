const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LandfillTransferSchema = new Schema({
    vehicle_id: {
        type: String,
        ref: 'Vehicle',
        required: true
    },
    // landfill_manager: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: false
    // },
    waste_volume: {
        type: Number,
        required: true
    },
    arrival_time: {
        type: Date,
        required: true
    },
    departure_time: {
        type: Date,
        required: true
    }
});

const LandfillTransfer = mongoose.model('LandfillTransfer', LandfillTransferSchema);
module.exports = LandfillTransfer;