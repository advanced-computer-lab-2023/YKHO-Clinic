const mongoose = require("mongoose");
const express = require("express");
const app = express();
const adminsTable = require("../model/admin.js");

const adminLogin = async (req, res) => {
  res.send("Admin Login page");
};
const adminHome = async (req, res) => {
  res.send("Admin Home page");
};
const adminRegister = async (req, res) => {
  res.send("Admin Register page");
};

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
    name: req.body.username,
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
  const deletedUser = null;
  if (req.body.userType == "admin") {
    deletedUser = await adminsTable.deleteOne({ name: req.body.name });
  } else if (req.body.userType == "patient") {
    deletedUser = await patientsTable.deleteOne({ name: req.body.name });
  } else {
    deletedUser = await doctorsTable.deleteOne({ name: req.body.name });
  }
  console.log(deletedUser);
};

const deleteHealthPackages = async (req, res) => {};

module.exports = {
  adminLogin,
  adminHome,
  adminRegister,
  createAdmin,
  deleteUser,
  goToDeletePatient,
  goToDeleteDoctor,
  goToHealthPackages,
  addHealthPackages,
  updateHealthPackages,
  deleteHealthPackages,
};
