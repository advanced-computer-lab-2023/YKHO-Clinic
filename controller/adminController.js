const mongoose = require("mongoose");
const express = require("express");
const app = express();
const adminsTable = require("../model/admin.js");
const {
  healthPackage: healthPackageTable,
  validateHealthPackage,
} = require("../model/healthPackage.js");
const patientsTable = require("../model/patient.js");
const { doctor: doctorsTable } = require("../model/doctor.js");

const adminLogin = async (req, res) => {
  const data = {
    name: 'Fuji',
  };
  res.render('../views/admin.ejs', data);
};
const adminHome = async (req, res) => {
  res.send("Admin Home page");
};
const adminRegister = async (req, res) => {
  res.send("Admin Register page");
};

const goToHealthPackages = async (req, res) => {};

const goToDeleteUser = async (req, res) => {
  res.send("Delete User");
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
  const userAvailable = adminsTable.findOne({ username: req.body.username });
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
  if (req.body.userType == "admin") {
    deletedUser = await adminsTable.deleteOne({ name: req.body.username });
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
  adminLogin,
  adminHome,
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
