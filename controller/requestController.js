const requestModel = require('../model/request.js');

const createRequest = async (req,res) => {
    const {username, password, name, DOB, email, mobile,rate,affiliation,education} = req.body;

    let request = new requestModel({
        username, password, name, DOB, email, mobile,rate,affiliation,education
    });

    request = await request.save();
    res.status(201).send(request);
};

module.exports = {createRequest};