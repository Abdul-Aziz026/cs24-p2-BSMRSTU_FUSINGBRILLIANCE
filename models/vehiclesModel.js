const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VechicleSchema = new Schema({
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
    }
    
})

const Vehicle = mongoose.model('Vehicle' , VechicleSchema);
module.exports = Vehicle;