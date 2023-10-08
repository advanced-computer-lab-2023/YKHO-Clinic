const mongoose = require('mongoose');
const patientModel = require('../model/patient');
const {doctor: doctorModel} = require('../model/doctor');
const { prescription } = require('../model/prescription');


let patient;
(async function(){ 
    patient = await patientModel.findOne();
})();

let doctors;
(async function(){ 
    doctors = await doctorModel.find().sort({name:1});
})();


const createPatient = async (req, res) => {
    // joi validation
    const { email, username, password, name, dob, gender, mobileNumber, emergency} = req.body;

    patient = new patientModel({
        email,
        username,
        password,
        name,
        dob,
        gender,
        mobileNumber,
        emergency
    });

    patient = await patient.save();
    res.status(201).send(patient);
}

const createFamilyMember = async (req,res) => {
    // joi validation
    const {name, nationalID, age, gender, relation} = req.body;

    let familyMember = {
        name,
        nationalID,
        age,
        gender,
        relation,
    };
    
    patient.familyMembers.push(familyMember);
    patient = await patient.save();
    familyMember = patient.familyMembers[patient.familyMembers.length-1];
    res.send(familyMember);
};

const readFamilyMembers = async (req,res) => {
    res.send(patient.familyMembers);
}

const filterDoctors = async (req,res) => {
    let speciality;
}

const ViewPrescriptions = async (req,res) => {
    let result = await prescription.find({patientID:req.body.id});
    res.send(result);
}
const FilterPrescriptions = async (req,res) => {
    let result
    if(req.body.filter=="DoctorName") {
        result= await prescription.find({doctorName:req.body.doctorName});
    }
    if(req.body.filter=="Date") {
        result= await prescription.find({date:req.body.date});
    }
    if(req.body.filter=="Filled") {
        result= await prescription.find({filled:req.body.filled});
    }
    res.send(result);
    
}
module.exports = { createPatient, createFamilyMember, readFamilyMembers, filterDoctors, ViewPrescriptions,FilterPrescriptions};