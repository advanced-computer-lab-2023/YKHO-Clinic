const requestModel = require('../model/request.js');

const createRequest = async (req,res) => {
    const {username, passwrod, name, DOB, email, mobile,rate,affliation,education} = req.body;

    let request = new requestModel({
        username, passwrod, name, DOB, email, mobile,rate,affliation,education
    });

    request = await request.save();
    res.status(201).send(request);
};

module.exports = {createRequest};