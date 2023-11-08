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
    mobile,
    rate,
    affiliation,
    education,
  } = req.body;
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.message);
  } else {
    const id = req.files[0].buffer;
    const medicalLicense = req.files[1].buffer;
    const medicalDegree = req.files[2].buffer;
    if(isStrongPassword(req.body.password) === false){
        console.log("WEAK PASSWORD");
        return res.render("doctor/register", {message:"password is weak"});
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword)
    let request = new requestModel({
      username,
      password: hashedPassword,
      name,
      DOB,
      email,
      mobile,
      rate,
      affiliation,
      education,
      id,
      medicalLicense,
      medicalDegree,
    });

    request = await request.save();
    res.status(201).send(request);
  }
};

module.exports = { createRequest };
