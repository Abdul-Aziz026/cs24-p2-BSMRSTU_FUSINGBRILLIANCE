const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stsSchema = new Schema({
    word_no: {
        type: String,
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
    sts_manager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default:null
    }
});

const sts = mongoose.model('STS', stsSchema);
module.exports = sts;