const mongoose = require('mongoose');
const Joi = require('joi');
const multer = require('multer');
const fs = require('fs');

const {doctor,validateDoctor} = require('../model/doctor.js');
const patientModel = require('../model/patient');
const appointmentsModel = require('../model/appointments');
const id="606aa80e929a618584d2758b";
async function createDoctor(req,res){
    const result=validateDoctor(req.body);
    if(result.error){
       return res.send(result.error.message)
    }
    else{
        let newDoctor= new doctor({name:req.body.name,
            username:req.body.username,
            password:req.body.password,
            email:req.body.email,
            DOB:req.body.DOB,
            rate:req.body.rate,
            affiliation:req.body.affiliation,
            education:req.body.education})
            try{
                newDoctor = await newDoctor.save();
                res.status(200).send(newDoctor)
            }
            catch(err){
                res.status(400).send(err.message)
            }
    } 
    
}
async function goToHome(req,res){
    res.render("doctor/doctorHome",{name:req.body.name});
}
async function updateMyInfo(req,res){
    res.render("doctor/doctorUpdate",{errormessage:""})
}
async function updateThis(req,res){
const updateTerm = req.body.updateTerm
const schema = Joi.object({
    email: Joi.string().email().min(1),
    rate:Joi.number().min(0),
    affiliation:Joi.string().min(1).max(20),
  }); 
  const result = schema.validate({ [updateTerm]: req.body.updateValue });
  if(result.error){
   res.render("doctor/doctorUpdate",{errormessage:result.error.message})
  }
  else{
        await doctor.findByIdAndUpdate(id, { [updateTerm]: req.body.updateValue })
        res.render("doctor/doctorUpdate",{errormessage:"Updated"})
  }

}

const uploadHealthRecord = async (req, res) => {
    const patientId = req.params.id;
    const patient = await patientModel.findById(patientId);
    if (!patient) {
     return res.status(404).send('Patient not found.');
    }
  
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const base64Data = req.file.buffer.toString('base64');

    patient.healthRecords.push({
      data: base64Data,
      contentType: req.file.mimetype,
    });

    await patient.save()
  .then(() => {
    res.redirect(`/doctor/patients/${patientId}`);
  })
  .catch((err) => {
    console.error(err);
    return res.status(500).send('Error saving patient data.');
  });

};


module.exports={createDoctor, goToHome, updateMyInfo, updateThis, uploadHealthRecord}; 