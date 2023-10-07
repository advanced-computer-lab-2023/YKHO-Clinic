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
    let result
    if(req.body.name){
         result = await appointment.find({}).populate("patientID",'name').select(["patientID","-_id"])
        
         result=result.filter((c)=>{
            
            return c.patientID.name.substring(0,req.body.name.length)==req.body.name
         }
         )
        
    }
    else{
         result = await appointment.find({doctorID:id}).populate("patientID",'name').select(["patientID","-_id"])
    }
    
    res.send(result);
}
async function showMyPatientInfo(req,res){
    const result = await appointment.find({doctorID:id,patientID:req.params.id}).populate("patientID","-_id").select(["patientID","-_id"])
    res.send(result);
}
async function showUpcomingAppointments(req,res){
    const result = await appointment.find({doctorID:id,date:{$gt:Date.now()}}).populate("patientID","-_id").select(["patientID","-_id"])
    res.send(result);
}

module.exports={createAppointment,showMyPatients,showMyPatientInfo,showUpcomingAppointments}; 