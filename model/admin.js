const mongoose = require("mongoose");
const express = require("express");
const app = express();

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: {type: String, required: true},
  OTP: { type:Number },
});

const admin = mongoose.model("Admin", adminSchema);

module.exports = admin;
