const mongoose = require('mongoose')
const Schema = mongoose.Schema
 
const userSchema = new mongoose.Schema({
    name:{type:String, required: true, unique:true},
    password:{type:String, required: true},
    email:{type:String, required: true, unique: true},
    role: {type:Number, required: true, default: 4},
    otp: {type:String, default: null},
    sts_id: {
        type: String,
        default: null
    }
});
 
const User = mongoose.model('User' , userSchema);
module.exports = User;