const mongoose = require("mongoose");
const express = require("express");
const app = express();

const port = 3000;

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
});

const admin = mongoose.model("Admin", adminSchema);

module.exports = admin;
