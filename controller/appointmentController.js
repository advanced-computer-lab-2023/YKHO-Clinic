const mongoose = require('mongoose');
const {appointment,validateAppointments} = require('../model/appointments.js');
const id="606aa80e929a618584d2758b";
async function createAppointment(req,res){
    const result=validateAppointments(req.body);
    if(result.error){
        res.send(result.error.message)
    }
    else{
        let newAppointment= new appointment({doctorID:req.body.doctorID,
            patientID:req.body.patientID,
            date:req.body.date,
            status:req.body.status})
            try{
                newAppointment = await newAppointment.save();
                res.status(200).send(newAppointment)
            }
            catch(err){
                res.status(400).send(err.message)
            }
    }
    
}
async function showMyPatients(req,res){
    const result = await appointment.find({doctorID:id}).select(["patientID","-_id"]).populate("patientID")
    res.send(result);
}
async function searchMyPatients(req,res){
    const result = await appointment.find({doctorID:id,}).select(["patientID","-_id"])
    res.send(result);
}
module.exports={createAppointment,showMyPatients};