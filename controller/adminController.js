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
const requestsTable = require("../model/request.js");
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

const adminRegister = async (req, res) => {
  res.render("admin/register.ejs");
};

const goToHealthPackages = async (req, res) => {
  const healthPackages = await healthPackageTable.find();
  res.render("admin/healthPackages", {
    healthPackages,
    createErrorMessage: "",
    deleteErrorMessage: "",
    updateErrorMessage: "",
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
    packageName: req.body.packageName,
  });

  const validated = validateHealthPackage(healthPackage);
  console.log(validated);
  if (validated.error) {
    const healthPackages = await healthPackageTable.find();
    res.render("admin/healthPackages", {
      healthPackages,
      createErrorMessage: validated.error.message,
      updateErrorMessage: "",
      deleteErrorMessage: "",
    });
  } else {
    try {
      if (healthPackageExists == null) {
        const result = await healthPackage.save();
        healthPackages = await healthPackageTable.find();
        res.render("admin/healthPackages", {
          healthPackages,
          createErrorMessage: "Health package created successfully",
          updateErrorMessage: "",
          deleteErrorMessage: "",
        });
        console.log(result);
      } else {
        healthPackages = await healthPackageTable.find();
        res.render("admin/healthPackages", {
          healthPackages,
          createErrorMessage: "Health package already exists",
          updateErrorMessage: "",
          deleteErrorMessage: "",
        });
      }
    } catch (ex) {
      healthPackages = await healthPackageTable.find();
      res.render("admin/healthPackages", {
        healthPackages,
        createErrorMessage: ex.message,
        updateErrorMessage: "",
        deleteErrorMessage: "",
      });
      return;
    }
  }
};
const callUpdateHealthPackage = async (req, res) => {
  updateHealthPackages(req, res);
};
const updateHealthPackages = async (req, res) => {
  //if not given any variable to update, it wont return an error and just leave it
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
        { packageName: req.body.packageName },
        {
          packageName: req.body.packageName,
          price: req.body.price,
          doctorDiscount: req.body.doctorDiscount,
          pharmacyDiscount: req.body.pharmacyDiscount,
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
  try {
    const healthPackage = await healthPackageTable.deleteOne({
      packageName: req.body.packageName,
    });
    console.log(req.body);
    const healthPackages = await healthPackageTable.find();
    console.log(healthPackage.deletedCount);
    if (healthPackage.deletedCount == 1)
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
  res.render("admin/deleteUser");
};

const deleteUser = async (req, res) => {
  let deletedUser = null;
  if (req.body.username == "") return res.status(400).send("INSERT USERNAME");
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

const goToUploadedInfo = async (req, res) => {
  const requests = await requestsTable.find();
  res.render("admin/uploadedInfo", {
    requests,
  });
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
  callUpdateHealthPackage,
  callDeleteHealthPackage,
};
