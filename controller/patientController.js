const mongoose = require('mongoose');
const patientModel = require('../model/patient');
const {doctor: doctorModel} = require('../model/doctor');
const { prescription } = require('../model/prescription');
const test={
    "_id": "606aa80e929a618584d2758b",
    "name": "kika",
    "gender": "female",
    "mobileNumber": "01224764545",
    "dob": {
      "$date": "2001-09-30T22:00:00.000Z"
    },
    "emergency": {
      "name": "rawez",
      "mobileNumber": "01280730418"
    },
    "healthPackage": "kikamima"
  };

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
    let result = await prescription.find({patientID:test._id}).select(["prescriptionName","doctorName"]);
    let prescriptionrows ='<tr><th>name</th></tr>';
    
    for(prescriptions in result){
        prescriptionrows=prescriptionrows + `<tr><td id="${result[prescriptions]._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[prescriptions].prescriptionName} </td></tr>`

    }
    res.render("patient/Prescriptions",{prescriptionrows:prescriptionrows,onepatient:true});
}
async function selectPrescription(req,res){
    try{
        const result = await prescription.find({patientID:test._id,_id:req.params.id})
        let prescriptionrows ='<tr><th>Name</th> <th>Date</th> \
         <th>Doctor Name</th> <th>Filled</th> </tr>';
            var date=result[0].date;
            if(date){
                date=date.toISOString().split('T')[0]
            }
            prescriptionrows=prescriptionrows + `<tr><td style="text-align: center;"> ${result[0].prescriptionName} </td><td style="text-align: center;\
            "> ${date} </td>\
             <td style="text-align: center;"> ${result[0].doctorName} </td> <td style="text-align: center;">\
              ${result[0].filled} </td>`
        
        res.render("patient/Prescriptions",{prescriptionrows:prescriptionrows,onepatient:false})
    }
    catch(error){
        res.send("Patient doesnt exist")
    }
}
const FilterPrescriptions = async (req,res) => {
    let result
    if(req.query.filter=="DoctorName") {
        result= await prescription.find({doctorName:req.query.searchvalue,patientID:test._id});
    }
    if(req.query.filter=="Date") {
        result= await prescription.find({date:req.query.searchvalue,patientID:test._id});
    }
    if(req.query.filter=="Filled") {
        result= await prescription.find({filled:req.query.searchvalue,patientID:test._id});
    }
    let prescriptionrows ='<tr><th>name</th></tr>';
    for(prescriptions in result){
        prescriptionrows=prescriptionrows + `<tr><td id="${result[prescriptions]._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[prescriptions].prescriptionName} </td></tr>`

    }
    res.render("patient/Prescriptions",{prescriptionrows:prescriptionrows,onepatient:false});
    
}
async function patientHome(req,res){
    res.render("patient/patientHome");
}
module.exports = { createPatient, createFamilyMember, readFamilyMembers, filterDoctors, ViewPrescriptions,FilterPrescriptions,patientHome,selectPrescription};