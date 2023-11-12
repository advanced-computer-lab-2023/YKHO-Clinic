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
 
    const id = req.files[0].buffer;
    const medicalLicense = req.files[1].buffer;
    const medicalDegree = req.files[2].buffer;

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
