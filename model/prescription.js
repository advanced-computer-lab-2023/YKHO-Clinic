const mongoose = require('mongoose');
const Joi = require('joi-oid');
const { doctor } = require("./doctor");
const patient = require("./patient");
const { medicine } = require('./medicine');
const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dosage: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    medicineID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: medicine,
    }
    //TODO: medicineID
});

const prescriptionPDF = {
    data: {
        type: Buffer,
        required: true
    }
}

const prescriptionSchema = new mongoose.Schema({
    prescriptionName:
    {
        type: String,
        required: true,
    },
    patientID:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: patient
    }
    ,
    doctorID:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: doctor
    },
    doctorName:
    {
        type: String,
        required: true,
    },
    date:
    {
        type: Date,
        required: true,
    },
    filled:
    {
        type: Boolean,
        required: true,
        default: false,
    },
    price:
    {
        type: Number,
        required: true,
        default: 0,
    },
    MedicineNames: [medicineSchema],
    paid:
    {
        type: Boolean,
        required: true,
        default: false,
    }
});
function validatePrescription(newPrescription) {
    const schema = Joi.object({
        prescriptionName: Joi.string().required(),
        patientID: Joi.objectId().required(),
        doctorID: Joi.objectId().required(),
        doctorName: Joi.string().required(),
        date: Joi.date().required(),
        filled: Joi.boolean().required(),
        price: Joi.number().required(),
    });
    return schema.validate(newPrescription);
}
const prescription = mongoose.model('prescription', prescriptionSchema);
module.exports = { prescription, validatePrescription };