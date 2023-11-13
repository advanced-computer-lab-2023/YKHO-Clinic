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
const { doctor: doctorTable } = require("../model/doctor.js");
const patientModel = require("../model/patient");
const {
  healthPackage: healthPackageTable,
  validateHealthPackage,
} = require("../model/healthPackage.js");
const patientsTable = require("../model/patient.js");
const requestsTable = require("../model/request.js");
const fileSchema = require("../model/request.js");
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
  try {
    if (req.body.username === "" || req.body.password === "") {
      return res.status(200).json({ message: "Fill the empty fields" });
    }

    let found = false;

    let admin = await adminsTable.findOne({
      username: req.body.username,
    });

    let patient = await patientModel.findOne({
      username: req.body.username,
    });

    let doctor = await doctorTable.findOne({
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
        //return res.status(200).json({ message: "Logged in successfully" });
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
        if (patient.healthPackage && patient.healthPackage != "none") {
          let healthPackage = await healthPackageTable.findOne({
            packageName: patient.healthPackage,
          });
          discount = healthPackage.doctorDiscount;
          discount = (100 - discount) / 100;
        }
        doctor = await doctorTable.find().sort({ name: 1 });
        let results = doctor.map(({ _id, name, speciality, rate }) => ({
          _id,
          name,
          speciality,
          sessionPrice: rate * 1.1 * discount,
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
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: err.message });
  }
};

const changePasswordAdmin = async (req, res) => {
  if (
    req.body.oldPassword === "" ||
    req.body.newPassword === "" ||
    req.body.confirmationPassword === ""
  ) {
    res.status(404).json({ message: "Fill the empty fields" });
  }

  const user = await adminsTable.findOne({
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
    await adminsTable.findOneAndUpdate(
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

const forgetPassword = async (req, res) => {
  let OTP = generateOTP();
  let email = "";

  if (req.user.type == "patient") {
    let patient = await patientModel.findOne({
      username: req.user.username,
    });
    patient.OTP = OTP;
    await patient.save();
    email = patient.email;
  } else if (req.user.type == "doctor") {
    let doctor = await doctorTable.findOne({
      username: req.user.username,
    });
    doctor.OTP = OTP;
    await doctor.save();
    email = doctor.email;
  } else {
    let admin = await adminsTable.findOne({
      username: req.user.username,
    });
    admin.OTP = OTP;
    await admin.save();
    email = admin.email;
  }

  sendOTPByEmail(email, OTP);
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
    from: "anything@inbox.mailtrap.io",
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

const adminLogout = (req, res) => {
  res.clearCookie("jwt").status(200).json({ message: "Logged out successfully" });
};

const createAdmin = async (req, res) => {
  if (
    req.body.password === "" ||
    req.body.username === "" ||
    req.body.email === ""
  ) {
    //look for any missing fields
    return res.status(200).json({ message: "Insert missing fields" });
  }

  const userAvailable = await adminsTable.findOne({
    username: req.body.username, //check if the username exists
  });

  const emailAvailable = await adminsTable.findOne({
    email: req.body.email, //check if the email exists
  });

  if (emailAvailable != null) {
    //if it exists
    return res.status(200).json({ message: "Email Unavailable" });
  }

  if (userAvailable != null) {
    //if it exists
    return res.status(200).json({ message: "username Unavailable" });
  }

  if (isStrongPassword(req.body.password) === false) {
    return res.status(200).json({ message: "password is weak" });
  }

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const adminUser = new adminsTable({
      username: req.body.username, //create the admin
      password: hashedPassword,
      email: req.body.email,
    });
    const result = await adminUser.save(); //save into DB

    return res.status(200).json({ message: "Admin Created" });
  } catch (ex) {
    return res.status(200).json({ message: ex.message });
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
      res.render("admin/healthPackages", {
        healthPackages,
        createErrorMessage: "Health package created successfully",
        updateErrorMessage: "",
        deleteErrorMessage: "",
      });
    } else {
      healthPackages = await healthPackageTable.find();
      res.render("admin/healthPackages", {
        healthPackages, //law la2a package
        createErrorMessage: "Health package already exists",
        updateErrorMessage: "",
        deleteErrorMessage: "",
      });
    }
  } catch (ex) {
    //law feh missing fields/out of bounds/wrong type inputs
    healthPackages = await healthPackageTable.find();
    res.render("admin/healthPackages", {
      healthPackages,
      createErrorMessage: ex.message,
      updateErrorMessage: "",
      deleteErrorMessage: "",
    });
    return;
  }
  // }
};
const callUpdateHealthPackage = async (req, res) => {
  updateHealthPackages(req, res);
};
const updateHealthPackages = async (req, res) => {
  //if not given any variable to update, it wont return an error and just leave it blank in DB
  const healthPackages = await healthPackageTable.find();
  const validated = validateHealthPackage(req.body);
  if (validated.error)
    res.render("admin/healthPackages", {
      healthPackages,
      updateErrorMessage: validated.error.message,
      createErrorMessage: "",
      deleteErrorMessage: "",
    });
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
        res.render("admin/healthPackages", {
          healthPackages,
          updateErrorMessage: "Health package updated successfully",
          createErrorMessage: "",
          deleteErrorMessage: "",
        });
      else
        res.render("admin/healthPackages", {
          healthPackages,
          updateErrorMessage: "Health package not found",
          createErrorMessage: "",
          deleteErrorMessage: "",
        });
    } catch (ex) {
      res.render("admin/healthPackages", {
        healthPackages,
        updateErrorMessage: ex.message,
        createErrorMessage: "",
        deleteErrorMessage: "",
      });
    }
  }
};
const callDeleteHealthPackage = async (req, res) => {
  deleteHealthPackages(req, res);
};
const deleteHealthPackages = async (req, res) => {
  if (req.body.packageName === "") {
    const healthPackages = await healthPackageTable.find(); //check if input is given
    res.render("admin/healthPackages", {
      healthPackages,
      updateErrorMessage: "",
      createErrorMessage: "", //mal72tsh a3ml7a beh JOI xD
      deleteErrorMessage: `"packageName" is not allowed to be empty`,
    });
  }
  try {
    const healthPackage = await healthPackageTable.deleteOne({
      packageName: req.body.packageName, //deletes
    });

    const healthPackages = await healthPackageTable.find(); //re get the packages excluding el deleted one b2a to update the page

    if (healthPackage.deletedCount == 1)
      //if deleted
      res.render("admin/healthPackages", {
        healthPackages,
        updateErrorMessage: "",
        createErrorMessage: "",
        deleteErrorMessage: "Health package deleted",
      });
    else
      res.render("admin/healthPackages", {
        healthPackages,
        updateErrorMessage: "",
        createErrorMessage: "",
        deleteErrorMessage: "Health package not found",
      });
  } catch (err) {
    res.send(err.message);
  }
};

const goToDeleteUser = async (req, res) => {
  res.render("admin/deleteUser", { message: "" });
};

const deleteUser = async (req, res) => {
  let deletedUser;
  if (req.body.username === "")
    return res.status(200).json({ message: "Fill the empty fields" });
  if (req.body.userType == "admin") {
    deletedUser = await adminsTable.deleteOne({ username: req.body.username });
  } else if (req.body.userType == "patient") {
    deletedUser = await patientsTable.deleteOne({
      username: req.body.username,
    });
  } else {
    deletedUser = await doctorTable.deleteOne({ username: req.body.username });
  }
  if (deletedUser.deletedCount == 1)
    return res.status(200).json({ message: "User deleted successfully" });
  else return res.status(200).json({ message: "User Not found" });
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
  console.log(type);
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
  res.send({
    File: File,
  });
}

const acceptRequest = async (req, res) => {
  const doctorToBeAccepted = await requestsTable.findOne({
    email: req.body.email,
  });
  console.log(doctorToBeAccepted)
  let id = {
    data: doctorToBeAccepted.id.data,
    contentType: doctorToBeAccepted.id.contentType,
  }

  let medicalLicense ={
    data: doctorToBeAccepted.medicalLicense.data,
    contentType: doctorToBeAccepted.medicalLicense.contentType,
  }

  let medicalDegree = {
    data: doctorToBeAccepted.medicalDegree.data,
    contentType: doctorToBeAccepted.medicalDegree.contentType,
  }
  
  let doctor = new doctorTable({
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
  await requestsTable.deleteOne({ email: req.body.email });
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
  showDoctorRecord,
  goToDeleteUser,
  goToHealthPackages,
  addHealthPackages,
  callUpdateHealthPackage,
  callDeleteHealthPackage,
  isStrongPassword,
  adminLogout,
  changePasswordAdmin,
  Login,
  acceptRequest,
  rejectRequest,
  forgetPassword,
};
