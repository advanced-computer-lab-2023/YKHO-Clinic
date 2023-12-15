const mongoose = require('mongoose');
const {doctor} = require("./doctor")
const patient = require("./patient")

const messageSchema = {
    text:{
        type: String,
    },
    date: {
        type: Date
    },
    isPatient:{
        type: Boolean
    },
    unread: {
        type: Boolean,
        default: true
    }
}

const chatSchema = new mongoose.Schema({
    room: {
        type: String
    },
    doctorID:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:doctor
    }
    ,
    patientID:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:patient
    },
    messages:[messageSchema],
},{timestamps:true})

const Chat = mongoose.model('chat', chatSchema);
module.exports = Chat;