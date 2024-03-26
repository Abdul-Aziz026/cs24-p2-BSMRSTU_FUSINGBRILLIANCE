const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LandfillTransferSchema = new Schema({
    vehicle_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    landfill_manager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    waste_volume: {
        type: Number,
        required: true
    },
    arrival_time: {
        type: Date,
        required: true,
        default: Date.now
    },
    departure_time: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const LandfillTransfer = mongoose.model('LandfillTransfer', LandfillTransferSchema);
module.exports = LandfillTransfer;
