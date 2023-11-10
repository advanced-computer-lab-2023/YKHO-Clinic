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
const appointmentsModel = require('../model/appointments');
let id;

const maxAge = 3 * 24 * 60 * 60;
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

const doctorLogin = async (req, res) => {
    if (req.body.username === "" || req.body.password === "") {
    //   res.render("doctor/login", { message: "Fill the empty fields" });
    res.status(404).error("Fill the empty fields");
    }
    
    const user = await doctor.findOne({ // Change find to findOne to get a single user
      username: req.body.username
    });
  
    if (user) {
        const found = await bcrypt.compare(req.body.password, user.password);
        if (found) {
        const token = createToken(user);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });

        const data = {
            name: user.username,
        };
        return res.render("doctor/doctorHome", data);
        }
    }
    // return res.render("doctor/login", { message: "Username or password is wrong" });
    res.status(404).send("Username or password is wrong");
  };

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
      return res.status(400).json({ message: "Timeslot clashes with existing timeslots" });
  }

  // Create the new timeslot
  const newTimeSlot = new timeSlot({day, from, to, doctorID: id  });
  await newTimeSlot.save();

  res.status(201).json({ message: "Timeslot created successfully" });
}
async function showTimeSlots(req,res){
   id=req.user._id;
  const days= ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let html="";
  for(day in days){
    
    html+=`<tr><th>${days[day]}</th>`;
    const results=await timeSlot.find({day:days[day],doctorID:id})
    for(result in results){
      html+=`<td id=${results[result]._id}>${results[result].from},${results[result].to}</td>`
    }
    html+="</tr>"
  }
  res.render("doctor/doctorTimeSlots",{timeSlot:html})
}
 
module.exports={createDoctor,goToHome,updateMyInfo,updateThis,checkContract, doctorLogin, uploadHealthRecord,createTimeSlot,showTimeSlots};
