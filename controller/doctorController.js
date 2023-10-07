const mongoose = require('mongoose');
const {doctor,validateDoctor} = require('../model/doctor.js');

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
module.exports=createDoctor;