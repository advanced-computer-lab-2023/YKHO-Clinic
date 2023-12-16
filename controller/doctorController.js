const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const { timeSlot } = require("../model/timeSlots");
const { promisify } = require("util");
const { doctor, validateDoctor } = require("../model/doctor.js");
const patientModel = require("../model/patient");
const notificationModel = require("../model/notification");
const { appointment } = require("../model/appointments");
const { healthPackage } = require("../model/healthPackage");
const { prescription, validatePrescription } = require("../model/prescription");
const { medicine, validateMedicine } = require("../model/medicine.js");
const requestModel = require("../model/request.js");
const followUpRequestModel = require("../model/followUpRequests.js");
const axios = require("axios");
const nodemailer = require("nodemailer");
const PDFDocument = require('pdfkit');
const Table = require('pdfkit-table');
let id;
let html;
const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
  return jwt.sign({ name }, process.env.SECRET, {
    expiresIn: maxAge,
  });
};

async function createDoctor(req, res) {
  const result = validateDoctor(req.body);
  if (result.error) {
    return res.send(result.error.message);
  } else {
    let newDoctor = new doctor({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      speciality: req.body.speciality,
      DOB: req.body.DOB,
      mobile: req.body.mobile,
      rate: req.body.rate,
      affiliation: req.body.affiliation,
      education: req.body.education,
      acceptedContract: true,
      id: req.body.id,
      medicalLicense: req.body.medicalLicense,
      medicalDegree: req.body.medicalDegree,
    });
    try {
      newDoctor = await newDoctor.save();
      res.status(200).send(newDoctor);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
}
async function createPrescription(req, res) {
    let newPrescription = new prescription({
      prescriptionName: req.body.name,
      patientID: req.body.id,
      doctorID: req.user._id,
      doctorName: req.user.name,
      date: new Date(),
      filled: false,
      price: 0,
      paid: false,
      MedicineNames: [],
    });
      newPrescription = await newPrescription.save();
      const presc = await prescription.find({ doctorID: req.user._id,patientID:req.body.id });
      res.status(200).json({result:presc});
  
}




async function createMedicine(req, res){
  console.log(req.body)
  id=req.user._id;
  let prescription1 =await prescription.findOne({_id:req.params.id});
  idmed=await medicine.findOne({name:req.body.name}).select(["_id"]);
  let medicinetobe= { name:req.body.name,dosage:req.body.dosage,price:parseFloat(req.body.price),medicineID:idmed}
  let medicinesup=prescription1.MedicineNames;
  medicinesup.push(medicinetobe);
  let pricenew = prescription1.price + parseFloat(req.body.price);
  prescription1 = await prescription.findByIdAndUpdate(
    req.params.id,
    { $set: { MedicineNames: medicinesup } },
    { new: true }
  );
  prescription1 = await prescription.findByIdAndUpdate(
    req.params.id,
    { $set: { price: pricenew } },
    { new: true }
  );
  res.status(200).json({result:medicinesup})
}

async function getNotificationsDoctor(req, res) {
    if(req.body.read){
      const updated = await notificationModel.updateMany({doctorID:req.user._id},{$set:{read:true}});
    }
    const notifications = await notificationModel.find({doctorID: req.user._id});
    const count = await notificationModel.countDocuments({doctorID: req.user._id, read: false});
    return res.status(200).json({result: notifications, readCount: count});
}

async function deleteMedicine(req,res){
  id=req.user._id;
  let prescription1 =await prescription.findOne({_id:req.body.id});
  let medicinesup=prescription1.MedicineNames; 
  medicinesup= medicinesup.filter(item =>item.name != req.body.name);
  let pricenew = prescription1.price-parseFloat(req.body.price);
  prescription1= await prescription.findByIdAndUpdate(req.body.id,{ $set: {MedicineNames: medicinesup} },{ new: true });
  prescription1= await prescription.findByIdAndUpdate(req.body.id,{ $set: {price: pricenew} },{ new: true });
  res.status(200).json({result:medicinesup})
  
}
async function updateMedicine(req,res){
  id=req.user._id;
  let prescription1 =await prescription.findOne({_id:req.body.id});
  let medicineup=[];
  let temp;
  for (let i = 0; i < prescription1.MedicineNames.length; i++) {
    if (prescription1.MedicineNames[i].name == req.body.name) {
      temp = prescription1.MedicineNames[i];
      temp.dosage = req.body.dosage;
      medicineup.push(temp);
    } else {
      medicineup.push(prescription1.MedicineNames[i]);
    }
  }
  prescription1= await prescription.findByIdAndUpdate(req.body.id,{ $set: {MedicineNames: medicineup} },{ new:true  });
  console.log(prescription1)
  res.status(200).json({result:prescription1})
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

async function ShowRequests(req, res) {
  const drId= req.user._id;
  const result = await followUpRequestModel.find({ doctorID: drId }).populate("patientID", "-healthRecords -medicalHistory");
  res.status(200).json({result:result});
}
async function AcceptFollowupRequest(req, res) {
  const drId= req.user._id;
  const id = req.body.id;
  const result = await followUpRequestModel.findById(id);
  appointmentt = new appointment({
    doctorID: drId,
    patientID: result.patientID,
    date: result.date,
    status: "upcoming",
    duration: result.duration,
    price: result.price,
    paid: true,
  });
  await appointmentt.save();
  await followUpRequestModel.deleteMany({ date: result.date });
  const newRequests= await followUpRequestModel.find({ doctorID: drId }).populate("patientID", "-healthRecords -medicalHistory");
  res.status(200).json({result:newRequests});
}
async function RejectFollowupRequest(req, res) {
  const drId= req.user._id;
  const id = req.body.id;
  await followUpRequestModel.findByIdAndDelete(id);
  const newRequests= await followUpRequestModel.find({ doctorID: drId }).populate("patientID", "-healthRecords -medicalHistory");
  res.status(200).json({result:newRequests});
}

async function loggedIn(req, res) {
  if (req.user) {
    res.status(200).json({ loggedIn: true, type: req.user.type });
  } else {
    res.status(200).json({ loggedIn: false, type: "" });
  }
}

const doctorLogout = (req, res) => {
  res.clearCookie("jwt").send(200, "Logged out successfully");
  res.render("/");
};

const changePasswordDoctor = async (req, res) => {
  if (
    req.body.oldPassword === "" ||
    req.body.newPassword === "" ||
    req.body.confirmationPassword === ""
  ) {
    return res.status(201).json({ message: "Fill the empty fields" });
  }

  const user = await doctor.findOne({
    username: req.user.username,
  });

  if (user && (await bcrypt.compare(req.body.oldPassword, user.password))) {
    if (req.body.newPassword != req.body.confirmationPassword) {
      return res.status(201).json({ message: "Passwords dont not match" });
    }

    if (isStrongPassword(req.body.newPassword) === false) {
      return res.status(201).json({ message: "Password must be at least 8 characters, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    await doctor.findOneAndUpdate(
      { username: req.user.username },
      { password: hashedPassword }
    );
    return res.status(200).json({ message: "Password changed successfully" });
  } else {
    return res
      .status(201)
      .json({ message: "Old Password is wrong" });
  }
};

function isStrongPassword(password) {
  if (password.length < 8) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }
  if (!/\d/.test(password)) {
    return false;
  }
  if (!/[*@#$%^&+=]/.test(password)) {
    return false;
  }
  return true;
}

async function goToHome(req, res) {
  res.status(200);
}
async function updateMyInfo(req, res) {
  res.render("doctor/doctorUpdate", { errormessage: "" });
}
async function updateThis(req, res) {
  id = req.user._id;
  const updateTerm = req.body.updateTerm;
  const schema = Joi.object({
    email: Joi.string().email().min(1),
    rate: Joi.number().min(0),
    affiliation: Joi.string().min(1).max(20),
  });
  const result = schema.validate({ [updateTerm]: req.body.updateValue });
  if (result.error) {
    res.status(200).json({ message: result.error.message });
  } else {
    await doctor.findByIdAndUpdate(id, { [updateTerm]: req.body.updateValue });
    res.status(200).json({ message: "updated successfully" });
  }
}
const checkContract = async (req, res, next) => {
  id = req.user._id;
  if (req.query.accept == "accept") {
    await doctor.findByIdAndUpdate(id, { acceptedContract: true });
    res.render("doctor/doctorHome", { name: req.body.name });
  } else {
    const result = await doctor.findById(id);
    if (result.acceptedContract) {
      res.status(200).json({ contract: "acc" });
    } else {
      res.status(200).json({ contract: "rej" });
    }
  }
};
const zlib = require('zlib');
const path = require('path');



const uploadHealthRecord = async (req, res) => {
  const patientId = req.params.id;
  const name = req.body.name;

  try {
    // Compress the file data using zlib
    const compressedData = zlib.gzipSync(req.file.buffer);

    await patientModel.findByIdAndUpdate(
      patientId,
      {
        $push: {
          healthRecords: {
            data: compressedData, // Save the compressed data
            contentType: req.file.mimetype,
            name: name,
          },
        },
      }
    );

    let result = await patientModel.findById(patientId, '-healthRecords.data');
    if (!result) {
      return res.status(404).send('Patient not found.');
    }

    // Remove the data property from the result
    res.status(200).json({ result: { patientID: result } });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error saving patient data.');
  }
};

module.exports = { uploadHealthRecord };

async function createTimeSlot(req, res) {
  id = req.user._id;
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
  const newTimeSlot = new timeSlot({ day, from, to, doctorID: id });
  await newTimeSlot.save();
  const times=await timeSlot.find({doctorID:id})
  res.status(200).json({message:"Timeslot created successfully.",times:times,ihavegonemad:true});
}
async function deleteTimeSlot(req, res) {
  const id = req.params.id;
  let result = await timeSlot.findByIdAndDelete(id);
  result = await timeSlot.find({ doctorID: req.user._id });
  res.status(200).json({ result: result });
}

async function cancelAppointment(req, res) {
  const id = req.body.id;
  const deletedAppointment = await appointment
    .findByIdAndUpdate(id, { status: "cancelled" }, { new: 1 })
    .exec();
  let dateConverted = (new Date(deletedAppointment.date)).toISOString();
  const date = `${dateConverted.split("T")[0]} at ${parseInt(dateConverted.split("T")[1].split(".")[0].split(":")[0])+2}:${dateConverted.split("T")[1].split(".")[0].split(":")[1]}`
  const wallet = deletedAppointment.price;
  const patient = await patientModel.findById(deletedAppointment.patientID,"-healthRecords");
  patient.wallet += wallet;
  await patient.save();
  const doctore = await doctor.findById(deletedAppointment.doctorID);
  doctore.Wallet -= wallet;
  await doctore.save();
  let newNotification = new notificationModel({
    patientID: patient._id,
    text: `Your appointment on ${date} has been cancelled by the doctor and the amount has been refunded to your wallet`,
    read: false,
    date: Date.now(),
  });
  await newNotification.save();

  let newNotification2 = new notificationModel({
    doctorID: deletedAppointment.doctorID,
    text: `Your appointment on ${date} with ${patient.name} is cancelled`,
    read: false,
    date: Date.now(),
  });
  await newNotification2.save();
  await sendEmail(
    patient.email,
    `Your appointment on ${date} has been cancelled by the doctor and the amount has been refunded to your wallet`
  );
  await sendEmail(
    doctore.email,
    `Your appointment on ${date} with ${patient.name} is cancelled`
  );
  res.status(200).json({ message: "Appointment cancelled successfully." });
}

async function showTimeSlots(req, res) {
  id = req.user._id;
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
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const date = new Date(req.params.date);
  const day = days[date.getDay()];
  let result = await timeSlot.find({ doctorID: doctorID, day: day });

  // Check if there is an appointment in the given date with the given doctor
  for (let i = 0; i < result.length; i++) {
    let startTime = result[i].from;
    const startHour = startTime.split(":")[0];
    const startMinute = startTime.split(":")[1];
    date.setHours(startHour);
    date.setMinutes(startMinute);
    const appointments = await appointment.find({
      doctorID: doctorID,
      date: date,
      status: "upcoming"||"rescheduled",
    });
    if (appointments.length > 0) {
      result.splice(i, 1);
      i--;
    }
  }
  res.status(200).json({ result: result });
}
async function createFollowUp(req, res) {
  doctorID = req.user._id;
  const id = req.body.appointmentId;
  const date = new Date(req.body.date);
  const time = req.body.time;
  const startTime = time.split("-")[0];
  const endTime = time.split("-")[1];
  const startH = parseInt(startTime.split(":")[0]);
  const startM = parseInt(startTime.split(":")[1]);
  const endH = parseInt(endTime.split(":")[0]);
  const endM = parseInt(endTime.split(":")[1]);

  let duration = (endH - startH) * 60 + (endM - startM);
  duration = duration / 60;
  const appointmentt = await appointment.findById(id);
  const pat = await patientModel.findById(appointmentt.patientID, "-healthRecords -medicalHistory");
  let price;
  if (pat.subscription.healthPackage != "none") {
    const healthPack = await healthPackage.find({
      packageName: pat.subscription.healthPackage,
    });
    price =
      req.user.rate * 1.1 -
      (req.user.rate * 1.1 * healthPack[0].doctorDiscount) / 100;
  } else {
    price = req.user.rate * 1.1;
  }
  // the startTime contains time in the format of 23:30 for example, so we need to split it to get the hours and minutes
  const startHour = startTime.split(":")[0];
  const startMinute = startTime.split(":")[1];
  date.setHours(startHour);
  date.setMinutes(startMinute);
  const newAppointment = new appointment({
    doctorID: doctorID,
    patientID: pat._id,
    date: date,
    status: "upcoming",
    duration: duration,
    price: price,
    paid: true,
  });
  await newAppointment.save();
  res.status(200).json({ message: "Appointment created successfully." });
}
const docViewWallet = async (req, res) => {
  doctorID = req.user._id;
  let doctorr = await doctor.findOne({ _id: doctorID }, "Wallet");
  Wallett = doctorr.Wallet;
  res.status(200).json({ Wallett: Wallett });
};
async function showHealthRecord(req, res) {
  const patientId = req.params.id;
  const healthId = req.params.healthId;

  try {
    const result = await patientModel
      .findById(patientId)
      .select({ healthRecords: { $slice: [parseInt(healthId), 1] } });

    if (!result || !result.healthRecords || result.healthRecords.length === 0) {
      return res.status(404).send('Health record not found.');
    }

    const compressedData = result.healthRecords[0].data;
    const decompressedData = zlib.gunzipSync(compressedData);

    const type = result.healthRecords[0].contentType;
    const name = result.healthRecords[0].name;

    res.set("Content-Type", "application/octet-stream");
    res.set(
      "Content-Disposition",
      `attachment; filename="${name}.${type.split("/")[1]}"`
    );
    
    res.send(decompressedData);
  } catch (error) {
    console.error('Error retrieving health record:', error);
    res.status(500).send('Error retrieving health record.');
  }
}
async function getName(req, res) {
  const id = req.user._id;
  const result = await doctor.findById(id, "name");
  res.status(200).json({ name: result.name });
}
const ViewPrescriptionsDoc = async (req, res) => {
  let result =  await prescription
  .find({ doctorID: req.user._id,patientID:req.query.id }).select(["prescriptionName","filled","MedicineNames"]);
  res.status(200).json({result});
};
async function sendEmail(email, message) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
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
    
  });
}

async function rescheduleAppointment(req, res) {
  const appointmentID = req.body.appointmentId;
  let date = new Date(req.body.date);
  const time = req.body.time;
  const startTime = time.split("-")[0];
  const endTime = time.split("-")[1];
  date.setHours(startTime.split(":")[0]);
  date.setMinutes(startTime.split(":")[1]);
  let dateConverted = date.toISOString();
  let dateText = `${dateConverted.split("T")[0]} at ${parseInt(dateConverted.split("T")[1].split(".")[0].split(":")[0])+2}:${dateConverted.split("T")[1].split(".")[0].split(":")[1]}`;
  const startH = parseInt(startTime.split(":")[0]);
  const startM = parseInt(startTime.split(":")[1]);
  const endH = parseInt(endTime.split(":")[0]);
  const endM = parseInt(endTime.split(":")[1]);
  const thisAppointment = await appointment.findById(appointmentID);
  let appointmentDate = new Date(thisAppointment.date);
  let appointmentDateConverted = appointmentDate.toISOString();
  let appointmentDateText = `${appointmentDateConverted.split("T")[0]} at ${parseInt(appointmentDateConverted.split("T")[1].split(".")[0].split(":")[0])+2}:${appointmentDateConverted.split("T")[1].split(".")[0].split(":")[1]}`;

  let duration = (endH - startH) * 60 + (endM - startM);
  duration = duration / 60;
  const pat = await patientModel.findById(thisAppointment.patientID,"-healthRecords -medicalHistory");
  const doctore = await doctor.findById(thisAppointment.doctorID);
  let price;
  if (pat.subscription.healthPackage != "none") {
    const healthPack = await healthPackage.find({
      packageName: pat.subscription.healthPackage,
    });
    price =
      doctore.rate * 1.1 -
      (doctore.rate * 1.1 * healthPack[0].doctorDiscount) / 100;
  } else {
    price = doctore.rate * 1.1;
  }

  const rescheduledAppointment = await appointment
    .findByIdAndUpdate(
      appointmentID,
      { date: date, price: price, duration: duration, status: "rescheduled" },
      { new: 1 }
    )
    .exec();
  
  let newNotification = new notificationModel({
    patientID: rescheduledAppointment.patientID,
    text: `Your Appointment with ${doctore.name} on ${appointmentDateText} rescheduled to ${dateText}`,
    read: false,
    date: Date.now(),
  });
  await newNotification.save();

  let newNotification2 = new notificationModel({
    doctorID: thisAppointment.doctorID,
    text: `Your appointment with ${pat.name} on ${appointmentDateText} is rescheduled to ${dateText}`,
    read: false,
    date: Date.now(),
  });
  await newNotification2.save();

  await sendEmail(
    pat.email,
    `Your Appointment with Doctor ${doctore.name} on ${appointmentDateText} rescheduled to ${dateText}`
  );
  await sendEmail(
    doctore.email,
    `Your appointment with ${pat.name} that was on ${appointmentDateText}} is rescheduled to ${dateText}`
  );
  res.status(200).json({ message: "Appointment rescheduled successfully." });
}

async function getMedicine(req, res) {
  let result = await medicine.find({}, "name price -_id");
  result = result.map(item => ({ price:item.price, label: item.name }));
  
  res.status(200).json({ result });
}

async function downloadPresc(req, res) {
  const id = req.params.id;
  console.log(id);
  const result = await prescription.findById(id).populate("patientID", "-healthRecords -medicalHistory");

  // Create a new PDF document
  const doc = new PDFDocument();

  // Set the response headers for PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="prescription.pdf"');
  doc.pipe(res);
  // Set font and font size
  doc.font('Helvetica-Bold');
  doc.fontSize(14);
  // Import the path module
  // Get the absolute path to the image file
  const imagePath = path.join(__dirname, '../images', 'logo.png');

  // Add the image to the PDF
  const imageWidth = 50;
  const imageHeight = 50;
  const imageX = (doc.page.width - imageWidth) / 2;
  doc.image(imagePath, imageX, doc.y, { width: imageWidth, height: imageHeight });

  doc.text('Prescription', { align: 'center', underline: true });
  doc.moveDown();
  

  // Add doctor name, patient name, date, and prescription name to the PDF
  doc.font('Helvetica');
  doc.fontSize(12);
  doc.text(`Doctor Name: ${result.doctorName} | Patient Name: ${result.patientID.name} | Date: ${result.date.toISOString().split('T')[0]} | Prescription Name: ${result.prescriptionName}`);
  doc.moveDown();
  doc.lineWidth(1); // Set the line width to the width of the page
  doc.strokeColor('#3B82F6'); // Set the line color to blue
  doc.lineCap('butt'); // Set the line cap style to butt
  doc.moveTo(0, doc.y).lineTo(doc.page.width, doc.y).stroke(); // Draw a line from left to right
  doc.moveDown();

  result.MedicineNames.forEach((medicine, index) => {
    doc.text(`Medicine ${index + 1}: ${medicine.name} | Dosage: ${medicine.dosage} | Price: ${medicine.price}`);
    doc.moveDown();
    doc.lineWidth(1); // Set the line width to the width of the page
  doc.strokeColor('#3B82F6'); // Set the line color to blue
  doc.lineCap('butt'); // Set the line cap style to butt
  doc.moveTo(0, doc.y).lineTo(doc.page.width, doc.y).stroke(); // Draw a line from left to right
  doc.moveDown();
  });

  // Add blue borders to the PDF
  doc.lineWidth(12); // Set the line width to 2 (or adjust as needed)
  doc.rect(0, 0, doc.page.width, doc.page.height).stroke('#3B82F6');

  // End the PDF document
  doc.end();
  
}

module.exports = {
  updatePresc,updateMedicine,
  deleteMedicine,
  createMedicine,
  createPrescription,
  docViewWallet,
  createDoctor,
  goToHome,
  updateMyInfo,
  updateThis,
  checkContract,
  uploadHealthRecord,
  createTimeSlot,
  showTimeSlots,
  deleteTimeSlot,
  showFollowUp,
  createFollowUp,
  loggedIn,
  showHealthRecord,
  getName,
  ViewPrescriptionsDoc,
  cancelAppointment,
  rescheduleAppointment,
  getMedicine,
  ShowRequests,
  AcceptFollowupRequest,
  RejectFollowupRequest,
  downloadPresc,
  getNotificationsDoctor,
  changePasswordDoctor,
};
