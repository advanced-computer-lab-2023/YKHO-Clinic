const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
app.use(express.urlencoded({ extended: true }));
const adminsTable = require("../model/admin.js");
const { doctor: doctorsTable } = require("../model/doctor.js");
const {
  healthPackage: healthPackageTable,
  validateHealthPackage,
} = require("../model/healthPackage.js");
const patientsTable = require("../model/patient.js");
const requestsTable = require("../model/request.js");
const prescriptionsTable = require("../model/prescription.js").prescription;
const appointmentsTable = require("../model/appointments.js").appointment;
const timeSlotsTable = require("../model/timeSlots.js").timeSlot;
// create json web token
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (user) => {
  return jwt.sign({ user }, process.env.SECRET, {
    expiresIn: maxAge,
  });
};

const goToAdminLogin = async (req, res) => {
  res.render("admin/login", { message: "" }); //message deh 3ashan ay error yatl3 feh nafs el page bas ba3ml7a empty fel awl
};

const Login = async (req, res) => {
  try{
    if (req.body.username === "" || req.body.password === "") {
      return res.status(200).json({ message: "Fill the empty fields" });
    }

    let found = false;

    let admin = await adminsTable.findOne({
      username: req.body.username,
    });

    let patient = await patientsTable.findOne({
      username: req.body.username,
    },"-healthRecords -medicalHistory");

    let doctor = await doctorsTable.findOne({
      username: req.body.username,
    });

    if (admin) {
      found = await bcrypt.compare(req.body.password, admin.password);
      if (found) {
        const token = createToken({ admin, type: "admin" });
        res.cookie("jwt", token, { expires: new Date(Date.now() + maxAge) });

        const data = {
          username: admin.username,
        };
        return res.status(200).json({ token: token, type: "admin" });

      }
    } else if (patient) {
      found = await bcrypt.compare(req.body.password, patient.password);

      if (found) {
        const token = createToken({
          _id: patient._id,
          username: patient.username,
          type: "patient",
        });

        res.cookie("jwt", token, { expires: new Date(Date.now() + maxAge) });

        let discount = 1;
        if (
          patient.subscription.healthPackage &&
          patient.subscription.healthPackage != "none"
        ) {
          let healthPackage = await healthPackageTable.findOne({
            packageName: patient.subscription.healthPackage,
          });
          discount = healthPackage.doctorDiscount;
          discount = (100 - discount) / 100;
        }

        doctor = await doctorsTable.find().sort({ name: 1 });
        let results = doctor.map(({ _id, name, speciality, rate }) => ({
          _id,
          name,
          speciality,
          sessionPrice: Math.floor(rate * 1.1 * discount),
        }));

        return res.status(200).json({ token: token, type: "patient" });
      }
    } else if (doctor) {
      found = await bcrypt.compare(req.body.password, doctor.password);
      if (found) {
        const token = createToken({
          _id: doctor._id,
          username: doctor.username,
          rate: doctor.rate,
          type: "doctor",
          name: doctor.name,
        });
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
        const data = {
          name: doctor.username,
        };

        return res.status(200).json({ token: token, type: "doctor" });
      }
    }

    if (!found)
      return res
      .status(200)
      .json({ message: "Username or password incorrect" });
  }catch(err){
    console.log(err);
    return res.status(404).json({ message: err.message });
  }
};

const changePasswordAdmin = async (req, res) => {

  oldPassword = req.body.oldPassword;
  newPassword = req.body.newPassword;
  confirmationPassword = req.body.confirmationPassword;
  if (
    oldPassword === "" ||
    newPassword === "" ||
    confirmationPassword === ""
  ) {
    return res.status(200).json({ message: "Fill the empty fields" });
  }

  const user = await adminsTable.findOne({
    username: req.user.admin.username,
  });
  if (user && (await bcrypt.compare(oldPassword, user.password))) {
    if (newPassword != confirmationPassword) {
      return res.status(200).json({ message: "Passwords dont not match" });
    }
    
    if (isStrongPassword(newPassword) === false) {
      return res.status(201).json({ message: "Password must be at least 8 characters, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character" });
    }
  
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await adminsTable.findOneAndUpdate(
      { username: req.user.admin.username },
      { password: hashedPassword }
    );
    return res.status(200).json({ message: "Password changed successfully" });
  } else {
    return res
      .status(200)
      .json({ message: "Old Password is wrong" });
  }
};

const goToNewPassword = (req, res) => {
  res.render("forgetPassword/enterNewPassword", {
    message: "",
    username: req.query.username,
  });
};

const sendOTP = async (req, res) => {
  let OTP = generateOTP();
  let username = req.query.username;
  let email = "";
  if (username == "") {
    return res.status(200).json( { message: "please enter your username"});
  }

  let patient = await patientsTable.findOne({
    username: req.query.username,
  });

  if (patient) email = patient.email;
  let doctor = await doctorsTable.findOne({
    username: req.query.username,
  });

  if (doctor) email = doctor.email;
  let admin = await adminsTable.findOne({
    username: req.query.username,
  });

  if (admin) email = admin.email;
  if (email != "") {
    sendEmail(email, OTP);
    return res.status(201).json( {
      OTP: OTP,
      message: "otp sent",
      username: username,
    });
  } else {
        return res.status(201).json( { message: "User not found"});
  }
};

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
async function sendEmail(email, OTP ) {
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
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${OTP}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

const checkOTP = async (req, res) => {
  if (req.body.OTP === "") {
    return res.status(404).json({ message: "Fill the empty fields" });
  }
  if (req.body.OTP === req.query.OTP) {
    return res.status(200).json({ message: "OTP is correct" });
  } else {
    return res.status(404).json({ message: "OTP is incorrect" });
  }
};

const forgetPassword = async (req, res) => {
  if (req.body.newPassword === "" || req.body.confirmationPassword === "") {
    return res.status(200).json({ message: "Fill the empty fields" });
  }

  if (req.body.newPassword != req.body.confirmationPassword) {
    return res.status(200).json({ message: "Passwords dont not match" });
  }

  if (isStrongPassword(req.body.newPassword) === false) {
    return res.status(201).json({ message: "Password must be at least 8 characters, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character" });
  }

  let admin = await adminsTable.findOne({
    username: req.body.username,
  });

  let patient = await patientsTable.findOne({
    username: req.body.username,
  });

  let doctor = await adminsTable.findOne({
    username: req.body.username,
  });

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
  if (admin) {
    admin = await adminsTable.findOneAndUpdate(
      { username: req.body.username },
      { password: hashedPassword }
    );
  }
  if (patient) {
    patient = await patientsTable.findOneAndUpdate(
      { username: req.body.username },
      { password: hashedPassword }
    );
  }
  if (doctor) {
    doctor = await doctorsTable.findOneAndUpdate(
      { username: req.body.username },
      { password: hashedPassword }
    );
  }

    return res.status(200).json({ message: "Password Changed" });
};

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function sendOTPByEmail(email, OTP) {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525, // or the port provided in your Mailtrap SMTP settings
    auth: {
      user: "784ac0344ac54c",
      pass: "b21deaba2fab04",
    },
  });

  // Extend the connection timeout to 30 seconds (in milliseconds)

  const mailOptions = {
    from: "@inbox.mailtrap.io",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${OTP}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  connectionTimeout: 30000;
}

const logout = (req, res) => {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logged out successfully" });
};

const createAdmin = async (req, res) => {
  username = req.body.username;
  password = req.body.password; 
  email = req.body.email;
  if (username === "" || password === "" || email === "") {
    //look for any missing fields
    return res.status(200).json({ message: "Insert missing fields" });
  }

  if (
    (await adminsTable.find({ username: username })).length > 0 ||
    (await doctorsTable.find({ username: username })).length > 0 ||
    (await patientsTable.find({ username: username })).length > 0 ||
    (await requestsTable.find({ username: username })).length > 0
  ) {
    return  res.status(200).json({ message: "username Unavailable" });
  }

  if (
    (await adminsTable.find({ email: email })).length > 0 ||
    (await doctorsTable.find({ email: email })).length > 0 ||
    (await patientsTable.find({ email: email })).length > 0 ||
    (await requestsTable.find({ email: email })).length > 0
  ) {
    return res.status(200).json({ message: "Email Unavailable" });
  }

  if (isStrongPassword(req.body.password) === false) {
    return res.status(201).json({ message: "Password must be at least 8 characters, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character" });
  }


    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const adminUser = new adminsTable({
      username: username, //create the admin
      password: hashedPassword,
      email: email,
      email: email,
    });
    const result = await adminUser.save(); //save into DB

    return res.status(200).json({ message: "Admin created successfully" });
  
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

const adminRegister = async (req, res) => {
  res.render("admin/register", { message: "" });
};

const goToHealthPackages = async (req, res) => {
  const healthPackages = await healthPackageTable.find(); //get all health Packages
  res.render("admin/healthPackages", {
    healthPackages, //i pass 4 variables, the packages table
    createErrorMessage: "", //create table error message
    deleteErrorMessage: "", //delete table error message
    updateErrorMessage: "", //update table error message
  });
};

const addHealthPackages = async (req, res) => {
  const validated = validateHealthPackage(req.body);
  if (validated.error) {
    return res.status(200).json({ message: validated.error.message });
  }
  const healthPackage = new healthPackageTable({
    packageName: req.body.packageName,
    price: req.body.price,
    doctorDiscount: req.body.doctorDiscount,
    pharmacyDiscount: req.body.pharmacyDiscount,
    familyDiscount: req.body.familyDiscount,
  });
  const healthPackageExists = await healthPackageTable.findOne({
    packageName: req.body.packageName, //check if the package exists already
  });
  try {
    if (healthPackageExists == null) {
      //law mal2ash package bel esm el maktob by add it
      const result = await healthPackage.save();
      healthPackages = await healthPackageTable.find();
      return res.status(200).json({ message: "package created successfully" });
    } else {
      return res.status(200).json({ message: "package already exists" });
    }
  } catch (ex) {
    //law feh missing fields/out of bounds/wrong type inputs
    return res.status(200).json({ message: ex.message, healthPackages: healthPackages });
  }
};
const callUpdateHealthPackage = async (req, res) => {
  updateHealthPackages(req, res);
};
const updateHealthPackages = async (req, res) => {
  //if not given any variable to update, it wont return an error and just leave it blank in DB
  const healthPackages = await healthPackageTable.find();
  const validated = validateHealthPackage(req.body);
  if (validated.error)
    return res.status(200).json({ message: validated.error.message });
  else {
    try {
      const healthPackage = await healthPackageTable.findOneAndUpdate(
        { packageName: req.body.packageName }, //find package by its name as its unique
        {
          packageName: req.body.packageName,
          price: req.body.price,
          doctorDiscount: req.body.doctorDiscount,
          pharmacyDiscount: req.body.pharmacyDiscount, //update values
          familyDiscount: req.body.familyDiscount,
        }
      );
      const healthPackages = await healthPackageTable.find();
      if (healthPackage != null)
        return res.status(200).json({ message: "package Edited successfully", healthPackages: healthPackages });
      else
        return res.status(200).json({message: "package not found"});
    } catch (ex) {
      res.status(200).json({ message: ex.message });
    }
  }
};

const callDeleteHealthPackage = async (req, res) => {
  try {
    let healthPackages = await healthPackageTable.findOneAndUpdate(
      { packageName: req.body.packageName },
      { deleted: true }
    );
    healthPackages = await healthPackageTable.find();
    return res.status(200).json({ healthPackages: healthPackages });
  } catch (err) {
    res.send(err.message);
  }
};

const goToDeleteUser = async (req, res) => {
  res.render("admin/deleteUser", { message: "" });
};

const deleteUser = async (req, res) => {
  let deletedUser;
  let type;
  if (req.body.username === "")
    return res.status(200).json({ message: "Fill the empty fields" });

    deletedUser = await adminsTable.findOneAndDelete({ username: req.body.username }).exec();
    if(deletedUser)
      type="admin";
    else{
      deletedUser = await patientsTable.findOneAndDelete({username: req.body.username,}).exec();
      if(deletedUser)
        type="patient";
      if(!deletedUser){
        deletedUser = await doctorsTable.findOneAndDelete({username: req.body.username,}).exec();
        if(deletedUser)
          type="doctor";
      }
    }

  
  if (type == "patient") {
    await appointmentsTable.deleteMany({
      patientID: deletedUser._id,
    });
    await prescriptionsTable.deleteMany({
      patientID: deletedUser._id,
    });
    
    const patients = await patientsTable.findById(deletedUser.agentID);
    if(patients){
      let famMembers = patients.familyMembers;
      for (let j = 0; j < patients.familyMembers.length; j++) {
        if (String(patients.familyMembers[j].patientID) == String(deletedUser._id)) {
          
          let member = famMembers.splice(j,1)[0];
          member.patientID = undefined;
          famMembers.push(member);
          patients.markModified('familyMembers');
          await patientsTable.findOneAndUpdate(
            { _id: patients._id },
            { familyMembers: famMembers }
          );
        }
      }
    } 
    let fams = await patientsTable.find({agentID: deletedUser._id});
    for(let i = 0; i < fams.length; i++){
      let patient = await patientsTable.findById(fams[i]._id);
      patient.agentID = undefined;
      patient.save();
    }
  } else if(type == "doctor") {
    deletedUser = await doctorsTable.findOneAndDelete({ username: req.body.username });
    const removeTimeSlots = await timeSlotsTable.deleteMany({
      doctorID: deletedUser._id,
    });
    const removeAppointments = await appointmentsTable.deleteMany({
      doctorID: deletedUser._id,
    });
    const removePrescriptions = await prescriptionsTable.deleteMany({
      doctorID: deletedUser._id,
    });
  }
  if (deletedUser)
    return res.status(200).json({ message: "User deleted successfully" });
  else{ 
    return res.status(200).json({ message: "User Not found" })
  };
};

const goToUploadedInfo = async (req, res) => {
  const requests = await requestsTable.find();
  return res.status(200).json({ requests: requests });
};

const getRequests = async (req, res) => {
  const requests = await requestsTable.find();
  return res.status(200).json({ requests: requests });
};



async function showDoctorRecord(req, res) {
  const doctorId = req.params.id;
  const type = req.params.file;
  let result = await requestsTable
    .find({ _id: doctorId })
    .select(["id", "medicalLicense", "medicalDegree"]);
  let File;
  if (type == "id") {
    File = result[0].id.data;
    let idType = result[0].id.contentType;
    let idName = "id";
    res.set(
      "Content-Disposition",
      `attachment; filename="${idName}.${idType.split("/")[1]}"`
    );
  }

  if (type == "medicalLicense") {
    File = result[0].medicalLicense.data;
    let licenseType = result[0].medicalLicense.contentType;
    let licenseName = "medical License";
    res.set(
      "Content-Disposition",
      `attachment; filename="${licenseName}.${licenseType.split("/")[1]}"`
    );
  }

  if (type == "medicalDegree") {
    File = result[0].medicalDegree.data;
    let degreeType = result[0].medicalDegree.contentType;
    let degreeName = "medical Degree";
    res.set(
      "Content-Disposition",
      `attachment; filename="${degreeName}.${degreeType.split("/")[1]}"`
    );
  }

  res.set("Content-Type", "application/octet-stream");
  res.send(File);
}

const acceptRequest = async (req, res) => {
  const doctorToBeAccepted = await requestsTable.findOne({
    email: req.body.email,
  });

  let id = {
    data: doctorToBeAccepted.id.data,
    contentType: doctorToBeAccepted.id.contentType,
  };

  let medicalLicense = {
    data: doctorToBeAccepted.medicalLicense.data,
    contentType: doctorToBeAccepted.medicalLicense.contentType,
  };

  let medicalDegree = {
    data: doctorToBeAccepted.medicalDegree.data,
    contentType: doctorToBeAccepted.medicalDegree.contentType,
  };

  let doctor = new doctorsTable({
    name: doctorToBeAccepted.name,
    username: doctorToBeAccepted.username,
    password: doctorToBeAccepted.password,
    email: doctorToBeAccepted.email,
    speciality: doctorToBeAccepted.speciality,
    DOB: doctorToBeAccepted.DOB,
    mobile: doctorToBeAccepted.mobile,
    rate: doctorToBeAccepted.rate,
    affiliation: doctorToBeAccepted.affiliation,
    education: doctorToBeAccepted.education,
    Wallet: 0,
    id: id,
    medicalDegree: medicalDegree,
    medicalLicense: medicalLicense,
    acceptedContract: false,
  });
  doctor = await doctor.save();
  await requestsTable.deleteOne({ email: req.query.email });
  const requests = await requestsTable.find();
  res.status(200).json({ requests: requests, message: "Doctor accepted" });
};

const rejectRequest = async (req, res) => {
  await requestsTable.deleteOne({ email: req.body.email });
  const requests = await requestsTable.find();
  res.status(200).json({ requests: requests, message: "Doctor Rejected" });
};

module.exports = {
  goToAdminLogin,
  adminRegister,
  createAdmin,
  deleteUser,
  goToUploadedInfo,
  getRequests,
  goToDeleteUser,
  goToHealthPackages,
  addHealthPackages,
  callUpdateHealthPackage,
  callDeleteHealthPackage,
  isStrongPassword,
  logout,
  changePasswordAdmin,
  Login,
  acceptRequest,
  rejectRequest,
  sendOTP,
  forgetPassword,
  goToNewPassword,
  showDoctorRecord,
};
