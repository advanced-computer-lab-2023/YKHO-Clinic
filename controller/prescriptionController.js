const mongoose = require('mongoose');
const {prescription,validatePrescription} = require('../model/appointments.js');

async function createPrescription(req,res){
    const result=validatePrescription(req.body);
    if(result.error){
        res.send(result.error.message)
    }
    else{
        let newPrescription= new prescription({prescriptionName:req.body.prescriptionName,doctorName:req.body.doctorName,
            patientID:req.body.patientID,
            date:req.body.date,
            filled:req.body.filled})
            try{
                newPrescription = await newPrescription.save();
                res.status(200).send(newPrescription)
            }
            catch(err){
                res.status(400).send(err.message)
            }
    }
    
}
module.export={createPrescription};