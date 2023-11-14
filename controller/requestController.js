const requestModel = require("../model/request.js");
const Joi = require("joi");
const multer = require("multer");
const bcrypt = require('bcrypt');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { isStrongPassword } = require("./adminController.js");
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
        return res.render("doctor/register", {message:"password is weak"});
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
    res.render("home", {message:"Request sent successfully"});
  }
};

module.exports = { createRequest };
