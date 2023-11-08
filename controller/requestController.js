const requestModel = require('../model/request.js');
const multer= require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createRequest = async (req,res) => {
    const {username, password, name, DOB, email, mobile,rate,affiliation,education} = req.body;
    const id= req.files[0].buffer;
    const medicalLicense=req.files[1].buffer;
    const medicalDegree=req.files[2].buffer;
    let request = new requestModel({
        username, password, name, DOB, email, mobile,rate,affiliation,education,id,medicalLicense,medicalDegree
    });

    request = await request.save();
    res.status(201).send(request);
};

module.exports = {createRequest}; 