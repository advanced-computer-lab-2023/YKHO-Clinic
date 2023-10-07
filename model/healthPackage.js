const mongoose = require("mongoose");
const express = require("express");
const app = express();

const healthPackagesSchema = new mongoose.Schema({
  name: {type: String, required:true},
  price: {type: Number, required:true},
  doctorsDiscount: {type: Number, required:true},
  pharmacyDiscount: {type: Number, required:true},
  familyDiscount: {type: Number, required:true}
});

const healthPackage = mongoose.model("HealthPackages", healthPackagesSchema);

module.exports = healthPackage;