const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    DOB: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,

    },
    speciality:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: ['dermatology', 'pediatrics', 'orthopedics'],
    },
    mobile: {
        type: String,
        required: true,
    },
    rate:
    {
        type:Number,
        required:true,
    },
    affiliation:
    {
        type:String,
        required:true,
    },
    education:
    {
        type:String,
        required:true,
    },
    id:{
        type:Buffer
    },
    medicalLicense:{
        type:Buffer
    },
    medicalDegree:{
        type:Buffer
    },
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;