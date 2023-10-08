const mongoose = require("mongoose");
const express = require("express");
const app = express();
const adminsTable = require("../model/admin.js");
const healthPackageTable = require("../model/healthPackage.js");
const patientsTable = require("../model/patient.js");
const {doctor: doctorsTable} = require("../model/doctor.js");

const adminLogin = async (req, res) => {
  res.send("Admin Login page");
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

const addHealthPackages = async (req, res) => {};

const updateHealthPackages = async (req, res) => {};

const createAdmin = async (req, res) => {
  const userAvailable = adminsTable.find({ username: "asd" });
  console.log(userAvailable);
  if (userAvailable.countDocuments > 0) {
    res.send("Username Unavailable");
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
  console.log("sadasd")
  let deletedUser = null;
  let userFound = null;
  if (req.body.userType == "admin") {
    deletedUser = await adminsTable.deleteOne({ name: req.body.username });
  } else if (req.body.userType == "patient") {
    deletedUser = await patientsTable.deleteOne({ username: req.body.username });
  } else {
    deletedUser = await doctorsTable.deleteOne({ username: req.body.username });
  }
  if(deletedUser.deletedCount == 1)
    res.status(200).send("USER DELETED");
  else
    res.status(400).send("USER NOT FOUND");
  console.log(deletedUser);
};

const deleteHealthPackages = async (req, res) => {};

module.exports = {
  adminLogin,
  adminHome,
  adminRegister,
  createAdmin,
  deleteUser,
  goToDeleteUser,
  goToHealthPackages,
  addHealthPackages,
  updateHealthPackages,
  deleteHealthPackages,
};
