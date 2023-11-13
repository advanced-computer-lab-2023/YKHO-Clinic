const requestModel = require("../model/request.js");
const Joi = require("joi");
const multer = require("multer");
const bcrypt = require('bcrypt');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { isStrongPassword } = require("./adminController.js");


const createRequest = async (req, res) => { 
  const {
    username,
    password,
    name,
    DOB,
    email,
    speciality,
    mobile,
    rate,
    affiliation,
    education,
  } = req.body;
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.message);
  } else {
    const id = { data: req.files[0].buffer, contentType: req.files[0].mimetype};
    const medicalLicense = { data: req.files[1].buffer, contentType: req.files[1].mimetype};
    const medicalDegree = { data: req.files[2].buffer, contentType: req.files[2].mimetype};

    if(isStrongPassword(req.body.password) === false){
        console.log("WEAK PASSWORD");
        return res.status(200).json({message:"password is weak"});
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword)
    console.log(speciality)
    let request = new requestModel({
      username,
      password: hashedPassword,
      name,
      DOB,
      email,
      speciality,
      mobile,
      rate,
      affiliation,
      education,
      id,
      medicalLicense,
      medicalDegree,
    });

    request = await request.save();
    res.status(201).json({ message: "request sent successfully" })
  }
;

module.exports = { createRequest };
