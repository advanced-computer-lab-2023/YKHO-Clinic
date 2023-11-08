const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const {doctor,validateDoctor} = require('../model/doctor.js');
const id="606aa80e929a618584d2758b";

const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
    return jwt.sign({ name }, 'secret', {
        expiresIn: maxAge
    });
};

async function createDoctor(req,res){
    const result=validateDoctor(req.body);
    if(result.error){
       return res.send(result.error.message)
    }
    else{
        let newDoctor= new doctor({name:req.body.name,
            username:req.body.username,
            password:req.body.password,
            email:req.body.email,
            DOB:req.body.DOB,
            rate:req.body.rate,
            affiliation:req.body.affiliation,
            education:req.body.education})
            try{
                newDoctor = await newDoctor.save();
                res.status(200).send(newDoctor)
            }
            catch(err){
                res.status(400).send(err.message)
            }
    } 
    
}

const doctorLogin = async (req, res) => {
    if (req.body.username === "" || req.body.password === "") {
    //   res.render("doctor/login", { message: "Fill the empty fields" });
    res.status(404).error("Fill the empty fields");
    }
    
    const user = await doctor.findOne({ // Change find to findOne to get a single user
      username: req.body.username
    });
  
    if (user) {
        const found = await bcrypt.compare(req.body.password, user.password);
        if (found) {
        const token = createToken(user.name);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });

        const data = {
            name: user.username,
        };
        return res.render("doctor/doctorHome", data);
        }
    }
    // return res.render("doctor/login", { message: "Username or password is wrong" });
    res.status(404).send("Username or password is wrong");
  };

async function goToHome(req,res){
    res.render("doctor/doctorHome",{name:req.body.name});
}
async function updateMyInfo(req,res){
    res.render("doctor/doctorUpdate",{errormessage:""})
}
async function updateThis(req,res){
const updateTerm = req.body.updateTerm
const schema = Joi.object({
    email: Joi.string().email().min(1),
    rate:Joi.number().min(0),
    affiliation:Joi.string().min(1).max(20),
  }); 
  const result = schema.validate({ [updateTerm]: req.body.updateValue });
  if(result.error){
   res.render("doctor/doctorUpdate",{errormessage:result.error.message})
  }
  else{
        await doctor.findByIdAndUpdate(id, { [updateTerm]: req.body.updateValue })
        res.render("doctor/doctorUpdate",{errormessage:"Updated"})
  }

}
const checkContract=async (req,res,next)=>{
   
    if(req.query.accept=="accept"){
        await doctor.findByIdAndUpdate(id, {acceptedContract:true})
        res.render("doctor/doctorHome",{name:req.body.name})
    }
    else{
    const result=await doctor.findById(id)
    if(result.acceptedContract){
        next();
    }
    else{
        res.render("doctor/doctorContract")
    }
}
}
module.exports={createDoctor,goToHome,updateMyInfo,updateThis,checkContract, doctorLogin}; 