const mongoose = require('mongoose');
const Joi = require('joi-oid');
const {doctor}= require("./doctor");
const patient= require("./patient");
const prescriptionSchema = new mongoose.Schema({
    prescriptionName:
    {
        type:String,
        required:true,
        minlength:5,
        maxlength:50,
    },
    patientID:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:patient
    }
    ,
    doctorID:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:doctor
    },
    doctorName:
    {
        type:String,
        required:true,
        minlength:5,
        maxlength:20,
    },
    date: 
    {
        type:Date,
        required:true,
    },
    filled:
    {
        type:Boolean,
        required:true,
        default:false,
    }
    });
    function validatePrescription(newPrescription){
        const schema = Joi.object({
            prescriptionName: Joi.string().required().min(5).max(50),
            patientID: Joi.objectId().required(),
            doctorID: Joi.objectId().required(),
            doctorName: Joi.string().required().min(5).max(20),
            date: Joi.date().required(),
            filled:Joi.boolean().required(),
          }); 
        return schema.validate(newPrescription);
    }
const prescription = mongoose.model('prescription', prescriptionSchema);
module.exports={prescription,validatePrescription};