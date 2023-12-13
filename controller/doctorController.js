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
const notificationModel = require("../model/notification");
const {appointment} = require('../model/appointments');
const {healthPackage} = require('../model/healthPackage');
const { prescription,validatePrescription } = require("../model/prescription");
const{medicine,validateMedicine}= require("../model/medicine.js");
const axios = require('axios');
const nodemailer = require("nodemailer");
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
async function createPrescription(req,res){
    const result=validatePrescription(req.body);
    if(result.error){
      return res.send(result.error.message)
    }
    else{
      let newPrescription= new prescription({
          prescriptionName:req.body.prescription,
          patientID:req.body.patientID,
          doctorID:req.body.doctorID,
          doctorName:req.body.doctorName,
          date:req.body.date,
          filled:req.body.filled,
          price:0,
          paid:req.body.paid
      })
        try{
          newPrescription= await newPrescription.save();
          res.status(200).send(newPrescription);
        }
        catch(err){
          res.status(400).send(err.message);
        }
    }
}




async function createMedicine(req, res){
  id=req.user._id;
  let prescription1 =await prescription.findOne({_id:req.params.id});
  idmed=await medicine.findOne({name:req.body.name}).select(["_id"]);
  let medicinetobe= { name:req.body.name,dosage:req.body.dosage,price:req.body.price,medicineID:idmed}
  let medicinesup=prescription1.MedicineNames;
  medicinesup.push(medicinetobe);
  let pricenew = prescription1.price+req.body.price;
  prescription1= await prescription.findByIdAndUpdate(req.params.id,{ $set: {MedicineNames: medicinesup} },{ new: true });
  prescription1= await prescription.findByIdAndUpdate(req.params.id,{ $set: {price: pricenew} },{ new: true });
};

async function deleteMedicine(req,res){
  id=req.user._id;
  let prescription1 =await prescription.findOne({_id:req.params.id});
  idmed=await medicine.findOne({name:req.body.name}).select(["_id"]);
  let medicinetobe= { name:req.body.name,dosage:req.body.dosage,price:req.body.price,medicineID:idmed};
  let medicinesup=prescription1.MedicineNames; 
  medicinesup= medicinesup.filter(item =>item.medicineID != medicinetobe.medicineID);
  let pricenew = prescription1.price-req.body.price;
  prescription1= await prescription.findByIdAndUpdate(req.params.id,{ $set: {MedicineNames: medicinesup} },{ new: true });
  prescription1= await prescription.findByIdAndUpdate(req.params.id,{ $set: {price: pricenew} },{ new: true });

}
async function updateMedicine(req,res){
  id=req.user._id;
  let prescription1 =await prescription.findOne({_id:req.params.id});
  let medicineup;
  let temp;
  for(let i=0;i<prescription1.MedicineNames;i++){
    if(prescription1.MedicineNames[i].name==req.body.name){
      temp=prescription1.MedicineNames[i]
      temp.dosage=req.body.dosage;
      medicineup.push(temp);
    }
    else{
    medicineup.push(prescription1.MedicineNames[i]);}
  }
  prescription1= await prescription.findByIdAndUpdate(req.params.id,{ $set: {MedicineNames: medicinesup} },{ new: true });

}
async function updatePresc(req,res){
  id=req.body._id;
  let prescription1 = await prescription.findOne({_id:req.params.id});
  let newPrescName = req.body.name;
  let newPrescFilled = req.body.filled;
  if(newPrescName!=null&&newPrescFilled!=null){
    prescription1=await prescription.findByIdAndUpdate(req.params.id,{$set: {prescriptionName:newPrescName,filled:newPrescFilled}},{new:true});}
  else if(newPrescFilled!=null){
    prescription1=await prescription.findByIdAndUpdate(req.params.id,{$set: {filled:newPrescFilled}},{new:true});
  }
  else if(newPrescName!=null){
    prescription1=await prescription.findByIdAndUpdate(req.params.id,{$set: {prescriptionName:newPrescName}},{new:true});
  }
}




async function loggedIn(req,res){
  if(req.user){
    res.status(200).json({loggedIn:true,type:req.user.type})
  }else{
    res.status(200).json({loggedIn:false,type:""})
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
  res.status(200);
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
    res.status(200).json({message:result.error.message})
  }
  else{
        await doctor.findByIdAndUpdate(id, { [updateTerm]: req.body.updateValue })
        res.status(200).json({message:"updated successfully"})
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
    res.status(200).json({contract:"acc"});
  }
  else{
    res.status(200).json({contract:"rej"});
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
  res.status(200).json({result:result});
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
  if(from>to){
    return res.status(200).json({message:"End time is less than starting time",ihavegonemad:false})
  }
  if (existingTimeSlots.length > 0) {
    return res.status(200).json({message:"Timeslot clashes with an existing timeslot",ihavegonemad:false})
   }
  

  // Create the new timeslot
  const newTimeSlot = new timeSlot({day, from, to, doctorID: id  });
  await newTimeSlot.save();
  const times=await timeSlot.find({doctorID:id})
  res.status(200).json({message:"Timeslot created successfully.",times:times,ihavegonemad:true});
}
async function deleteTimeSlot(req, res) {
  const id = req.params.id;
  let result = await timeSlot.findByIdAndDelete(id);
  result = await timeSlot.find({ doctorID: req.user._id });
  res.status(200).json({result:result});
}

async function cancelAppointment(req, res) {
  const id = req.body.id;
  console.log(id);
  const deletedAppointment = await appointment.findByIdAndUpdate(id,{status:"cancelled"},{new:1}).exec();
  const wallet = deletedAppointment.price;
  const patient = await patientModel.findById(deletedAppointment.patientID);
  const updatedPatient = await patientModel.findByIdAndUpdate(deletedAppointment.patientID,  { Wallet: patient.Wallet + wallet });
  const doctore = await doctor.findById(deletedAppointment.doctorID);
  let newNotification = new notificationModel({
    patientID: patient._id,
    text: "Your appointment has been cancelled by the doctor and the amount has been refunded to your wallet",
    date: Date.now(),
  });
  await newNotification.save();

  let newNotification2 = new notificationModel({
    doctorID: deletedAppointment.doctorID,
    text: `Your appointment with ${patient.name} is cancelled`,
    date: Date.now(),
  });
  await newNotification2.save();
  await sendEmail(patient.email, "Your appointment has been cancelled by the doctor and the amount has been refunded to your wallet");
  await sendEmail(doctore.email, `Your appointment with ${patient.name} is cancelled`);
  res.status(200).json({message:"Appointment cancelled successfully."});
}

async function showTimeSlots(req,res){ 
   id=req.user._id;
  // const days= ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  // html="";
  // for(day in days){
    
  //   html+=`<tr><th >${days[day]}</th>`;
  //   const results=await timeSlot.find({day:days[day],doctorID:id})
  //   for(result in results){
  //     html+=`<td  cursor:pointer" onClick="handleDelete(this)" id=${results[result]._id}>${results[result].from},${results[result].to}</td>`
  //   }
  //   html+="</tr>"
  // }
  // res.render("doctor/doctorTimeSlots",{timeSlot:html , message:""})
  const result=await timeSlot.find({doctorID:id})

  res.status(200).json({result:result})
  
}
// async function showFollowUp(req, res) {
//   const doctorID = req.user._id;
//   const id = req.params.id;
//   //if (req.query.date) {
//     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const date = new Date(req.query.date);
//     const day = days[date.getDay()];
//     const result = await timeSlot.find({ doctorID: doctorID, day: day });
//     // let html=""
//     // for( resu in result){
//     //   html+=`<button onClick="reserveTHIS(this)">${result[resu].from},${result[resu].to}</button>`
//     // }
//     //res.render("doctor/doctorFollowUp", { id: req.params.id, buttons: html ,date:req.query.date});
//     res.status(200).json({ result: result });
//   // } else {
//   //   const result = await timeSlot.find({ doctorID: id });
//   //   res.render("doctor/doctorFollowUp", { id: req.params.id, buttons: "",date:"" });
//   // }
// }
async function showFollowUp(req, res) {
  const doctorID = req.user._id;
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const date = new Date(req.params.date);
  const day = days[date.getDay()];
  let result = await timeSlot.find({ doctorID: doctorID, day: day });

  // Check if there is an appointment in the given date with the given doctor
  for(let i=0;i<result.length;i++){
    let startTime=result[i].from;
    const startHour=startTime.split(":")[0];
    const startMinute=startTime.split(":")[1];
    date.setHours(startHour);
    date.setMinutes(startMinute);
  const appointments = await appointment.find({ doctorID: doctorID, date: date });
  if (appointments.length > 0) {
    result.splice(i, 1);
    i--;
  }
}
  res.status(200).json({ result: result });
}
async function createFollowUp(req,res){
  doctorID=req.user._id;
  const id=req.body.appointmentId;
  const date=new Date(req.body.date);
  const time=req.body.time;
  const startTime=time.split("-")[0];
  const endTime=time.split("-")[1];
  const startH = parseInt(startTime.split(":")[0]);
  const startM = parseInt(startTime.split(":")[1]);
  const endH = parseInt(endTime.split(":")[0]);
  const endM = parseInt(endTime.split(":")[1]);

  let duration = (endH - startH) * 60 + (endM - startM);
  duration= duration/60;
  const appointmentt = await appointment.findById(id);
  const pat= await patientModel.findById(appointmentt.patientID);
  let price;
  if(pat.subscription.healthPackage!="none"){
  const healthPack = await healthPackage.find({packageName:pat.subscription.healthPackage});
price= req.user.rate*1.1 - (req.user.rate*1.1*healthPack[0].doctorDiscount)/100;
  }
  else{
  price= req.user.rate*1.1;
  }
  // the startTime contains time in the format of 23:30 for example, so we need to split it to get the hours and minutes
  const startHour=startTime.split(":")[0];
  const startMinute=startTime.split(":")[1];
  date.setHours(startHour);
  date.setMinutes(startMinute);
  const newAppointment=new appointment({doctorID:doctorID,patientID:pat._id,date:date,status:"upcoming",duration:duration,price:price,paid:true})
  await newAppointment.save();
  res.status(200).json({message:"Appointment created successfully."});
}
const docViewWallet = async(req,res) =>{
  doctorID=req.user._id;
  let doctorr= await doctor.findOne({_id:doctorID},"Wallet");
  Wallett=doctorr.Wallet;
  res.status(200).json({Wallett:Wallett});
}
async function showHealthRecord(req,res){
  const patientId=req.params.id;
  const healthId=req.params.healthId;
  let result = await patientModel.find({_id:patientId}).select(["healthRecords"]);
  let file = result[0].healthRecords[healthId].data;
  let type = result[0].healthRecords[healthId].contentType;
  let name = result[0].healthRecords[healthId].name;
  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Disposition', `attachment; filename="${name}.${type.split("/")[1]}"`); 
  res.send(file);
  }
async function getName(req,res){  
  const id=req.user._id;
  const result=await doctor.findById(id,"name")
  res.status(200).json({name:result.name})
}
const ViewPrescriptionsDoc = async (req, res) => {
  doctorp = await doctor.findOne({ _id: req.user._id });
  let result = await prescription
    .find({ doctorID: doctorp._id,patientID:req.query.id }).populate("patientID")
    .select(["prescriptionName","filled", "patientID"]);
  // let prescriptionrows = "<tr><th>name</th></tr>";

  // for (prescriptions in result) {
  //   prescriptionrows =
  //     prescriptionrows +
  //     <tr><td id="${result[prescriptions]._id}" onclick="showThis(event)" style="cursor: pointer;"> ${result[prescriptions].prescriptionName} </td>\
  //       </tr>;
  // }
  // res.render("patient/Prescriptions", {
  //   prescriptionrows: prescriptionrows,
  //   onepatient: true,
  // });
  res.status(200).json(result);
};
async function sendEmail(email, message ) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: "yousseftyoh@gmail.com",
    to: "aclclinictest@gmail.com",
    subject: "appointment confirmation",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

async function rescheduleAppointment(req, res) {
  const appointmentID = req.body.appointmentId;
  const date=new Date(req.body.date);
  const time=req.body.time;
  console.log(time);
  const startTime=time.split("-")[0];
  const endTime=time.split("-")[1];
  date.setHours(startTime.split(":")[0]);
  date.setMinutes(startTime.split(":")[1]);
  const startH = parseInt(startTime.split(":")[0]);
  const startM = parseInt(startTime.split(":")[1]);
  const endH = parseInt(endTime.split(":")[0]);
  const endM = parseInt(endTime.split(":")[1]);
  const thisAppointment = await appointment.findById(appointmentID);
  let duration = (endH - startH) * 60 + (endM - startM);
  duration= duration/60;
  const pat= await patientModel.findById(thisAppointment.patientID);
  const doctore = await doctor.findById(thisAppointment.doctorID);
  let price;
  if(pat.subscription.healthPackage!="none"){
  const healthPack = await healthPackage.find({packageName:pat.subscription.healthPackage});
price= doctore.rate*1.1 - (doctore.rate*1.1*healthPack[0].doctorDiscount)/100;
  }
  else{
  price= doctore.rate * 1.1;
  }

  const rescheduledAppointment = await appointment.findByIdAndUpdate(appointmentID,{date: date,price:price,duration:duration,status:"rescheduled"},{new:1}).exec();
  const patient = await patientModel.findById(rescheduledAppointment.patientID);
  let newNotification = new notificationModel({
    patientID: rescheduledAppointment.patientID,
    text: `Appointment rescheduled to ${req.body.date}`,
    date: Date.now(),
  });
  await newNotification.save();

  let newNotification2 = new notificationModel({
    doctorID: thisAppointment.doctorID,
    text: `Your appointment with ${patient.name} is rescheduled to ${req.body.date}`,
    date: Date.now(),
  });
  await newNotification2.save();


  await sendEmail(patient.email, `Appointment with Doctor ${doctore.name} on ${thisAppointment.date} rescheduled to ${rescheduleAppointment.date}`);
  await sendEmail(doctore.email, `Your appointment with ${patient.name} that was on ${thisAppointment.date}} is rescheduled to ${rescheduleAppointment.date}`);
  res.status(200).json({message:"Appointment rescheduled successfully."});
}


module.exports={updatePresc,updateMedicine,deleteMedicine,createMedicine,createPrescription,docViewWallet,createDoctor,goToHome,updateMyInfo,updateThis,checkContract, uploadHealthRecord,createTimeSlot,showTimeSlots,deleteTimeSlot,showFollowUp,createFollowUp,loggedIn,showHealthRecord,getName,ViewPrescriptionsDoc,cancelAppointment,rescheduleAppointment};
