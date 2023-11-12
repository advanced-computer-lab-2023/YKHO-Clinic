const mongoose = require('mongoose');
const { buffer } = require('stream/consumers');
const medicalHistorySchema={
    name:{
        type:String,
    },
    document:{
        type:buffer,
    },
    mimeType:{
        type:String,
    }
}

const familyMemberSchema = {
    patientID:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:'Patient',
        unique: true,
    },
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
        trim: true,
    },
    relation: {
        type: String,
        required: true,
        enum: ['husband', 'wife', 'son','daughter'],
        lowercase: true,
        trim: true,
    },
}
const healthRecordSchema = {
    name:{
        type:String,
        required:true,
    },
    data: {
        type: Buffer,
        required: true
      },
    contentType: {
        type: String,
        required: true
    }
}

const patientSchema = new mongoose.Schema({
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
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,

    },
    mobile: {
        type: String,
        required: true,
    },
    emergency: {
        name: String,
        mobile: String
    },
    familyMembers: [familyMemberSchema],
    healthPackage: {
        type: String,
        default: "none",
    },
    healthRecords: [healthRecordSchema],
    medicalHistory: [medicalHistorySchema],
    agentID:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:'Patient',
    },
    Wallet:
    {
        type:Number,
        required:true,
    },

    OTP: { type:Number },
})


// joi validation

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient; 