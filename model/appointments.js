const mongoose = require('mongoose');
const Joi = require('joi-oid')
const {doctor}= require("./doctor")
const patient= require("./patient")
const appointmentSchema = new mongoose.Schema({
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
    status: {
        type: String,
        required: true,
        enum: ['upcoming', 'completed', 'cancelled', 'rescheduled'],
        lowercase: true,
        trim: true,
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
function validateAppointments(newAppointment){
    const schema = Joi.object({
        doctorID: Joi.objectId().required(),
        patientID: Joi.objectId().required(),
        date: Joi.date().required()
    });
    return schema.validate(newAppointment);
}
const appointment = mongoose.model('appointment', appointmentSchema);
module.exports={appointment,validateAppointments};


