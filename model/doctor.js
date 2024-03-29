const mongoose = require('mongoose');
const Joi = require('joi');

const fileSchema = new mongoose.Schema({
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
  });

const doctorSchema = new mongoose.Schema({
    name:
    {
        type:String,
        required:true,
        maxlength:20,
    }
    ,
    username:
    {
        type:String,
        required:true,
        maxlength:20,
    },
    password: 
    {
        type:String,
        required:true,
    },
    email:
    {
        type:String,
        required:true,
    },
    DOB:{
        type:Date,
        required:true,
    },
    rate:
    {
        type:Number,
        required:true,
    },
    mobile: {
        type: String,  
        required: true,
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
    speciality:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: ['dermatology', 'pediatrics', 'orthopedics'],
    },
    acceptedContract:{
        type: Boolean,
        default: false,
    },
    id:fileSchema,
    medicalLicense:fileSchema,
    medicalDegree:fileSchema,
    Wallet:
    {
        type:Number,
        required:true,
        default:0,
    },
    });
const doctor = mongoose.model('doctor', doctorSchema);

function validateDoctor(newDoctor){
    const schema = Joi.object({
        name: Joi.string().required().max(20),
        username: Joi.string().required().max(20),
        password: Joi.string().required().max(20),
        email: Joi.string().email().required(),
        DOB: Joi.date().required(),
        rate:Joi.number().required(),
        affiliation:Joi.string().required(),
        education:Joi.string().required(),
        speciality:Joi.string().required(),
      }); 
    return schema.validate(newDoctor);
}

module.exports={doctor,validateDoctor};