const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const sts = require('./stsModel');
// const Vehicle = require('./vehiclesModel');

const WasteCollectionSchema = new Schema({
    sts_id:{
        type: Schema.Types.ObjectId,
        ref:'sts',
        required:true
    },
    vehile_id:{
        type:Schema.Types.ObjectId,
        ref:'Vehicle',
        required:true
    },
    waste_volume:{
        type:Number,
        required:true
    },
    arrival_time: {
        type: Date,
        required: true,
        default: Date.now,
    },
    departure_time: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

const WasteCollection = mongoose.model('WasteCollection' , WasteCollectionSchema);
module.exports = WasteCollection;