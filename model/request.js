const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    DOB: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,

    },
    mobile: {
        type: String,
        required: true,
    },
    rate:
    {
        type:Number,
        required:true,
    },
    affiliation:
    {
        type:String,
        required:true,
    },
    education:
    {
        type:String,
        required:true,
    },
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;