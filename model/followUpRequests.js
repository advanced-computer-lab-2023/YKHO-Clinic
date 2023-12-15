const mongoose = require('mongoose');
const {doctor} = require("./doctor");
const patient = require("./patient");
const followUpRequestSchema = new mongoose.Schema({
    doctorID:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:doctor
    }
    ,
    patientID:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:patient
    },
    date:
    {
        type:Date,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
});

const FollowUpRequest = mongoose.model('FollowUpRequest', followUpRequestSchema);

module.exports = FollowUpRequest;
