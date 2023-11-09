const express = require("express");
const { model } = require("mongoose");
const app = express();
app.use(express.urlencoded({ extended: true }));

const home = async (req, res) => {
  res.render("home", { message:"" });
};

module.exports = { home };
