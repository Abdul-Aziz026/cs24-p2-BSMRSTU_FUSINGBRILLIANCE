const mongoose = require('mongoose');
<<<<<<< HEAD

// Define schema for STS
const STSSchema = new mongoose.Schema({
    sts_id: mongoose.Schema.Types.ObjectId,
    ward_no: {
        type: Number,
=======
const Schema = mongoose.Schema;

const stsSchema = new Schema({
    word_no: {
        type: String,
>>>>>>> 6bd435a687b37b6fc71c3809e69e5881b665aeb4
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
<<<<<<< HEAD
    sts_mgr_id: {
        type: String,
        default: null
    },
});

// Create a Mongoose model
const STS = mongoose.model('STS', STSSchema);

module.exports = STS;
=======
    sts_manager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default:null
    }
});

const sts = mongoose.model('STS', stsSchema);
module.exports = sts;
>>>>>>> 6bd435a687b37b6fc71c3809e69e5881b665aeb4
