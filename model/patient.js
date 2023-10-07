const mongoose = require('mongoose');

const subSchema = {
    name: {
        type: String,
        required: true,
    },
    nationalID: {
        type: Number,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
        lowercase: true,
        trim:true,
    },
    relation: {
        type: String,
        required: true,
        enum: ['sister', 'brother', 'mother', 'father', 'grandmother', 'grandfather', 'daugther', 'son', 'wife', 'husband'],
        lowercase: true,
        trim:true,
    },
}

const patientSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },    
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,

    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'], 
        lowercase: true,
        trim:true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    emergency: {
        name: String,
        mobileNumber: String
    },
    family:[subSchema],

})


const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient; 