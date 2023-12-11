const requestModel = require("../model/request.js");
const Joi = require("joi");
const multer = require("multer");
const bcrypt = require('bcrypt');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { isStrongPassword } = require("./adminController.js");
const admin = require("../model/admin.js");
const {doctor}= require("../model/doctor.js");
const Patient= require("../model/patient.js");
const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  DOB: Joi.date().iso().required(),
  email: Joi.string().email().required(),
  speciality: Joi.string().required(),
  mobile: Joi.string().pattern(new RegExp("^\\d{11}$")).required(),
  rate: Joi.number().positive().required(),
  affiliation: Joi.string().required(),
  education: Joi.string().required(),
});

const createRequest = async (req, res) => {
  let {
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
  console.log(req.body);
  DOB = new Date(DOB);
  const id = { data: req.files[0].buffer, contentType: req.files[0].mimetype};
  const medicalLicense = { data: req.files[1].buffer, contentType: req.files[1].mimetype};
  const medicalDegree = { data: req.files[2].buffer, contentType: req.files[2].mimetype};

  if(isStrongPassword(req.body.password) === false){
    return res.status(201).json({message:"password is weak"});
  }
  
  if( (await admin.find({username:username})).length>0 || (await doctor.find({username:username})).length>0  || (await Patient.find({username:username})).length>0  || (await requestModel.find({username:username})).length>0 ){
    return res.status(201).json({message:"username already exists"});
  }
  if( (await admin.find({mobile:mobile})).length>0 || (await doctor.find({mobile:mobile})).length>0  || (await Patient.find({mobile:mobile})).length>0  || (await requestModel.find({mobile:mobile})).length>0 ){
    return res.status(201).json({message:"mobile already exists"});
  }
    if( (await admin.find({email:email})).length>0 || (await doctor.find({email:email})).length>0  || (await Patient.find({email:email})).length>0  || (await requestModel.find({email:email})).length>0 ){
      return res.status(201).json({message:"email already exists"});
    }
    
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  
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
  // res.render("home", {message:"Request sent successfully"});
  return res.status(201).json({ message: "request sent successfully" });
  
};

module.exports = { createRequest };
