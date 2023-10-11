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
  res.render("admin/login", {message: ""});//message deh 3ashan ay error yatl3 feh nafs el page bas ba3ml7a empty fel awl
};

const adminLogin = async (req, res) => {
  const user = await adminsTable.findOne({//bydwr 3ala ay had beh same user and pass
    username: req.body.username,
    password: req.body.password,
  });

  if (user != null) {//if found a match
    const data = {
      username: user.username,//passing the username to the html so that i can say welcome "admin name"
    };
    return res.render("admin/home", data);
  } else return res.send("username or passowrd is wrong");
};

const createAdmin = async (req, res) => {
  if(req.body.password === "" || req.body.username === ""){//look for any missing fields
    return res.render("admin/register", {message:"Insert missing fields"});
  }

  const userAvailable = await adminsTable.findOne({
    username: req.body.username,//check if the username exists
  });
  
  if (userAvailable != null) {//if it exists 
    return res.render("admin/register", {message:"Username Unavailable"});
  }
  const adminUser = new adminsTable({
    username: req.body.username,//create the admin
    password: req.body.password,
  });
  try {
    const result = await adminUser.save();//save into DB
    console.log(result);
    res.render("admin/register",{message:"Admin created successfully"});
  } catch (ex) {
    res.render("admin/register",{message:ex.message});
  }
};

const adminRegister = async (req, res) => {
  res.render("admin/register", {message:""});
};

const goToHealthPackages = async (req, res) => {
  const healthPackages = await healthPackageTable.find();//get all health Packages
  res.render("admin/healthPackages", {
    healthPackages,//i pass 4 variables, the packages table
    createErrorMessage: "",//create table error message
    deleteErrorMessage: "",//delete table error message
    updateErrorMessage: "",//update table error message
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
    packageName: req.body.packageName,//check if the package exists already
  });//el code el commented dah kan mafrod joi validation ma3rftsh ashghlo wa i gave up lol, i use mongo validation now wa khalas
  
  // const validated = validateHealthPackage(healthPackage);
  // console.log(validated);
  // if (validated.error) {
  //   const healthPackages = await healthPackageTable.find();
  //   res.render("admin/healthPackages", {
  //     healthPackages,
  //     createErrorMessage: validated.error.message,
  //     updateErrorMessage: "",
  //     deleteErrorMessage: "",
  //   });
  // } else {
    try {
      if (healthPackageExists == null) {//law mal2ash package bel esm el maktob by add it 
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
          healthPackages,//law la2a package
          createErrorMessage: "Health package already exists",
          updateErrorMessage: "",
          deleteErrorMessage: "",
        });
      }
    } catch (ex) {//law feh missing fields/out of bounds/wrong type inputs
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
        { packageName: req.body.packageName },//find package by its name as its unique
        {
          packageName: req.body.packageName,
          price: req.body.price,
          doctorDiscount: req.body.doctorDiscount,
          pharmacyDiscount: req.body.pharmacyDiscount,//update values
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
  if(req.body.packageName === ""){
    const healthPackages = await healthPackageTable.find();//check if input is given
    res.render("admin/healthPackages", {
      healthPackages,
      updateErrorMessage: "",
      createErrorMessage: "",//mal72tsh a3ml7a beh JOI xD
      deleteErrorMessage: `"packageName" is not allowed to be empty`,
    });
  }
  try {
    const healthPackage = await healthPackageTable.deleteOne({
      packageName: req.body.packageName,//deletes
    });
    console.log(req.body);
    const healthPackages = await healthPackageTable.find();//re get the packages excluding el deleted one b2a to update the page
    console.log(healthPackage.deletedCount);               //with the new table 
    if (healthPackage.deletedCount == 1)//if deleted 
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
  res.render("admin/deleteUser", {message:""});
};

const deleteUser = async (req, res) => {
  let deletedUser = null;
  if (req.body.username === "") res.render("admin/deleteUser", { message: "Insert username"})
  if (req.body.userType == "admin") {//check the user and delete using its username which is unique
    deletedUser = await adminsTable.deleteOne({ username: req.body.username });
  } else if (req.body.userType == "patient") {
    deletedUser = await patientsTable.deleteOne({ username: req.body.username,});
  } else {
    deletedUser = await doctorsTable.deleteOne({ username: req.body.username });
  }
  if (deletedUser.deletedCount == 1) 
    res.render("admin/deleteUser", { message: "User deleted successfully"})
  else     
    res.render("admin/deleteUser", { message: "User not found"})
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
