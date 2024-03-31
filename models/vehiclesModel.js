const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VechicleSchema = new Schema({
    registrationNo: {
        type: Number,
        required: true
    },
    vehicle_type:{
        type:String,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    },
    availability:{
        type:Boolean,
        required:true
    },
    loaded: {
        type: Number,
        required: true
    },
    unloaded: {
        type: Number,
        required: true
    }
});
/*
{
    "vehicle_type": "Truck",
    "capacity": 3,
    "availability": true,
    "loaded": 10,
    "unloaded": 5
}

*/

const Vehicle = mongoose.model('Vehicle' , VechicleSchema);
module.exports = Vehicle;