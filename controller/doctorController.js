const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const {timeSlot} = require('../model/timeSlots');
const { promisify } = require("util");
const {doctor,validateDoctor} = require('../model/doctor.js');
const patientModel = require('../model/patient');
const {appointment} = require('../model/appointments');
const {healthPackage} = require('../model/healthPackage');
const axios = require('axios');
let id;
let html;
const maxAge = 3 * 24 * 60 * 60  ;
const createToken = (name) => {
    return jwt.sign({ name }, process.env.SECRET, {
        expiresIn: maxAge
    });
};

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
            speciality:req.body.speciality,
            DOB:req.body.DOB,
            mobile:req.body.mobile,
            rate:req.body.rate,
            affiliation:req.body.affiliation,
            education:req.body.education,
            acceptedContract: true,
            id:req.body.id,
            medicalLicense:req.body.medicalLicense,
            medicalDegree:req.body.medicalDegree
          })
            try{
                newDoctor = await newDoctor.save();
                res.status(200).send(newDoctor)
            }
            catch(err){
                res.status(400).send(err.message)
            }
    } 
    
}

const doctorLogout = (req, res) => {
    res.clearCookie('jwt').send(200,"Logged out successfully");
    res.render("/");
}

const changePasswordDoctor = async (req, res) => {
    if ( req.body.oldPassword === "" || req.body.newPassword === "" || req.body.confirmationPassword === "") {
      res.status(404).json({ message: "Fill the empty fields" });
    }
    
    const user = await doctor.findOne({
      username: req.user.username,
    });

    if (user && (await bcrypt.compare(req.body.oldPassword, user.password))) {
      if (req.body.newPassword != req.body.confirmationPassword) {
        return res.status(404).json({ message: "Passwords dont not match" });
      }
  
      if (isStrongPassword(req.body.newPassword) === false) {
        return res.status(404).json({ message: "Password is weak" });
      }
  
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
      await doctor.findOneAndUpdate(
        { username: decodedCookie.name },
        { password: hashedPassword }
      );
      return res.status(200).json({ message: "Password changed successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "Password not changed successfully" });
    }
};

async function goToHome(req,res){
    res.render("doctor/doctorHome",{name:req.body.name});
}
async function updateMyInfo(req,res){
    res.render("doctor/doctorUpdate",{errormessage:""})
}
async function updateThis(req,res){
 id=req.user._id;
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
const checkContract=async (req,res,next)=>{
  id=req.user._id;
  if(req.query.accept=="accept"){
      await doctor.findByIdAndUpdate(id, {acceptedContract:true})
      res.render("doctor/doctorHome",{name:req.body.name})
  }
  else{
  const result=await doctor.findById(id)
  if(result.acceptedContract){
      next(); 
  }
  else{
      res.render("doctor/doctorContract")
  }
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
async function createTimeSlot(req, res) {
  id=req.user._id;
  const day = req.body.day;

  const { from, to } = req.body;

  // Check if the new timeslot clashes with any previously added timeslots
  const existingTimeSlots = await timeSlot.find({
      $or: [
          { from: { $lte: from }, to: { $gte: from } },
          { from: { $lte: to }, to: { $gte: to } },
          { from: { $gte: from }, to: { $lte: to } },
      ],
      doctorID: id,
      day: day,
  });

  if (existingTimeSlots.length > 0) {
    return res.render("doctor/doctorTimeSlots",{timeSlot:html, message:"Timeslot clashes with an existing timeslot"})
  }
  if(from>to){
   return res.render("doctor/doctorTimeSlots",{timeSlot:html, message:"end time is less than starting time"})
  }

  // Create the new timeslot
  const newTimeSlot = new timeSlot({day, from, to, doctorID: id  });
  await newTimeSlot.save();

  res.redirect("/doctor/timeSlots");
}
async function deleteTimeSlot(req, res) {
  const id = req.params.id;
  const result = await timeSlot.findByIdAndDelete(id);
  res.redirect("/doctor/timeSlots");
}
async function showTimeSlots(req,res){ 
   id=req.user._id;
  const days= ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  html="";
  for(day in days){
    
    html+=`<tr><th >${days[day]}</th>`;
    const results=await timeSlot.find({day:days[day],doctorID:id})
    for(result in results){
      html+=`<td  cursor:pointer" onClick="handleDelete(this)" id=${results[result]._id}>${results[result].from},${results[result].to}</td>`
    }
    html+="</tr>"
  }
  res.render("doctor/doctorTimeSlots",{timeSlot:html , message:""})
}
async function showFollowUp(req, res) {
  const doctorID = req.user._id;
  const id = req.params.id;
  if (req.query.date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(req.query.date);
    const day = days[date.getDay()];
    const result = await timeSlot.find({ doctorID: doctorID, day: day });
    let html=""
    for( resu in result){
      html+=`<button onClick="reserveTHIS(this)">${result[resu].from},${result[resu].to}</button>`
    }
    res.render("doctor/doctorFollowUp", { id: req.params.id, buttons: html ,date:req.query.date});
  } else {
    const result = await timeSlot.find({ doctorID: id });
    res.render("doctor/doctorFollowUp", { id: req.params.id, buttons: "",date:"" });
  }
}
async function createFollowUp(req,res){
  doctorID=req.user._id;
  const id=req.params.id;
  const date=new Date(req.query.date);
  const time=req.query.time;
  const startTime=time.split(",")[0];
  const endTime=time.split(",")[1];
  const startH = parseInt(startTime.split(":")[0]);
  const startM = parseInt(startTime.split(":")[1]);
  const endH = parseInt(endTime.split(":")[0]);
  const endM = parseInt(endTime.split(":")[1]);

  let duration = (endH - startH) * 60 + (endM - startM);
  duration= duration/60;
  const pat= await patientModel.findById(id);
  let price;
  if(pat.healthPackage!="none"){
  const healthPack = await healthPackage.find({packageName:pat.healthPackage});
price= duration*req.user.rate - (duration*req.user.rate*healthPack[0].doctorDiscount)/100;
  }
  else{
  price= duration*req.user.rate;
  }
  // the startTime contains time in the format of 23:30 for example, so we need to split it to get the hours and minutes
  const startHour=startTime.split(":")[0];
  const startMinute=startTime.split(":")[1];
  date.setHours(startHour);
  date.setMinutes(startMinute);

  // Check if there is an existing appointment at the specified time
  const existingAppointment = await appointment.findOne({ doctorID: doctorID, date: date });
  if (existingAppointment) {
    return res.status(400).send("There is already an appointment at the specified time.");
  }

  const newAppointment=new appointment({doctorID:doctorID,patientID:id,date:date,status:"upcoming",duration:duration,price:price,paid:true})
  await newAppointment.save();
  res.redirect("/doctor/appointments")
}
const docViewWallet = async(req,res) =>{
  doctorID=req.user._id;
  let doctorr= await doctor.findOne({_id:doctorID});
  Wallett=doctorr.Wallet;
  res.render("doctor/Wallet",{Wallett: Wallett});
}

module.exports={docViewWallet,createDoctor,goToHome,updateMyInfo,updateThis,checkContract, uploadHealthRecord,createTimeSlot,showTimeSlots,deleteTimeSlot,showFollowUp,createFollowUp};
