const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const adminsTable = require("../model/admin.js");
const {
  healthPackage: healthPackageTable,
  validateHealthPackage,
} = require("../model/healthPackage.js");
const patientsTable = require("../model/patient.js");
const { doctor: doctorsTable } = require("../model/doctor.js");

const goToAdminLogin = async (req, res) => {
  res.render("admin/login");
};

const adminLogin = async (req, res) => {
  const user = await adminsTable.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user != null) {
    const data = {
      username: user.username,
    };
    return res.render("admin/home", data);
  } else return res.send("username or passowrd is wrong");
};

const adminRegister = async (req, res) => {
  res.render("admin/register.ejs");
};

const goToHealthPackages = async (req, res) => {
  const healthPackages = await healthPackageTable.find();
  res.render("admin/healthPackages", {healthPackages});
};

const goToDeleteUser = async (req, res) => {
  res.render("admin/deleteUser");
};

const goToUploadedInfo = async (req, res) => {
  res.send("Doctors uploaded info");
};

const addHealthPackages = async (req, res) => {
  const healthPackage = new healthPackageTable({
    name: req.body.name,
    price: req.body.price,
    doctorDiscount: req.body.doctorDiscount,
    pharmacyDiscount: req.body.pharmacyDiscount,
    familyDiscount: req.body.familyDiscount,
  });
  try {
    const result = await healthPackage.save();
    console.log(result);
  } catch (ex) {
    res.send(ex.message);
    return;
  }
  res.send(`${req.body.name} HealthPackage Created`);
};

const updateHealthPackages = async (req, res) => {
  //if not given any variable to update, it wont return an error and just leave it
  const validated = validateHealthPackage(req.body);
  if (validated.error) return res.send(validated.error.message);
  try {
    const healthPackage = await healthPackageTable.findOneAndUpdate(
      { name: req.body.name },
      {
        price: req.body.price,
        doctorDiscount: req.body.doctorDiscount,
        pharmacyDiscount: req.body.pharmacyDiscount,
        familyDiscount: req.body.familyDiscount,
      }
    );
  } catch (ex) {
    res.send(ex.message);
    return;
  }
  res.send(`${req.body.name} HealthPackage Updated`);
};

const deleteHealthPackages = async (req, res) => {
  try {
    const healthPackage = await healthPackageTable.deleteOne({
      name: req.body.name,
    });
  } catch (err) {
    res.send(err.message);
    return;
  }
  res.send(`${req.body.name} HealthPackage Deleted`);
};

const createAdmin = async (req, res) => {
  const userAvailable = await adminsTable.findOne({
    username: req.body.username,
  });
  console.log(userAvailable);
  if (userAvailable != null) {
    return res.send("Username Unavailable");
  }
  const adminUser = new adminsTable({
    username: req.body.username,
    password: req.body.password,
  });
  try {
    const result = await adminUser.save();
    console.log(result);
  } catch (ex) {
    res.send(ex.message);
    return;
  }
  res.send(
    `Admin Created with user ${req.body.username} and password ${req.body.password}`
  );
};

const deleteUser = async (req, res) => {
  let deletedUser = null;
  if(req.body.username == "")
    return res.status(400).send("INSERT USERNAME");
  if (req.body.userType == "admin") {
    deletedUser = await adminsTable.deleteOne({ username: req.body.username });
  } else if (req.body.userType == "patient") {
    deletedUser = await patientsTable.deleteOne({
      username: req.body.username,
    });
  } else {
    deletedUser = await doctorsTable.deleteOne({ username: req.body.username });
  }
  if (deletedUser.deletedCount == 1) res.status(200).send("USER DELETED");
  else res.status(400).send("USER NOT FOUND");
  console.log(deletedUser);
};

module.exports = {
  goToAdminLogin,
  adminLogin,
  adminRegister,
  createAdmin,
  deleteUser,
  goToUploadedInfo,
  goToDeleteUser,
  goToHealthPackages,
  addHealthPackages,
  updateHealthPackages,
  deleteHealthPackages,
};
