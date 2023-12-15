const chatModel = require("../model/chat");
const appointmentModel = require('../model/appointments.js').appointment;

const chats = async (req,res) => {
    let chats = [];
    if(req.user.type == "patient"){
        chats = await chatModel.find({patientID: req.user._id}).populate("doctorID").sort({ "updatedAt": -1 });;
        chats = chats.map(({room,doctorID,patientID,messages}) => ({
            room,
            name: doctorID.name,
            speciality: doctorID.speciality,
            messages:messages.map(({_id,text,isPatient,unread,date}) =>(
                {
                    _id,
                    text,
                    isPatient,
                    unread,
                    time: date.getHours() + ":"  + date.getMinutes()
                }
            )),
            unread: (() => {
                let count = 0;
                for(let i = 1; i <= messages.length; i++){
                    if(messages[messages.length - i].unread && !messages[messages.length - i].isPatient){
                        count++;
                    }
                    else{
                        break;
                    }
                }
                return count
                })()
        }));
    }
    else {
        chats = await chatModel.find({doctorID: req.user._id}).populate("patientID");
        chats = chats.map(({room,patientID,messages}) => ({
            room,
            name: patientID.name,
            messages:messages.map(({_id,text,isPatient,unread,date}) =>(
                {
                    _id,
                    text,
                    isPatient,
                    unread,
                    time: date.getHours() + ":"  + date.getMinutes()
                }
            )),
            unread: (() => {
                let count = 0;
                for(let i = 1; i <= messages.length; i++){
                    if(messages[messages.length - i].unread && messages[messages.length - i].isPatient){
                        count++;
                    }
                    else{
                        break;
                    }
                }
                return count
                })()
        }));
    }
    res.status(200).json(chats);
}

const send = async (req,res) => {
    let chat = await chatModel.find({room:req.body.room})
    
    let message = {
        text:req.body.text,
        date: new Date(Date.now()),
        isPatient: (req.user.type == "patient"? true: false)
    }

    chat.messages.push(message);
    chat.save();
    
    res.status(200).json(chat); 
}

const save = async ({room, text, isPatient, time}) => {
    let chat = await chatModel.findOne({room:room})

    let message = {
        text,
        date: new Date(time),
        isPatient
    }

    chat.messages.push(message);
    chat.save();
}

const read = async (req,res) => {
    let chat = await chatModel.findOne({room:req.body.room});
    for(let i = 1; i <= chat.messages.length && (req.user.type == 'patient'? !chat.messages[chat.messages.length -i].isPatient : chat.messages[chat.messages.length -i].isPatient) && chat.messages[chat.messages.length - i].unread ; i++){
        chat.messages[chat.messages.length - i].unread = false;
    }

    chat.save();

    res.status(200).json({chat}); 
}

const contacts = async (req, res) => {

    let results = [];
    if(req.user.type == "patient"){
        let chats = await chatModel.find({patientID:req.user._id}).select({_id:0,doctorID:1});
        let doctors = chats.map(({doctorID})=>(String(doctorID)));

        let appointments = await appointmentModel.find({patientID:req.user._id}).populate("doctorID").select({_id:0,doctorID:1});
        
        // filter appointments
        appointments = appointments.filter((appointment) => {
            if(doctors.includes(String(appointment.doctorID._id))){
                return false;
            }
            return true;
        })

        // map results
        results = appointments.map(({doctorID}) => ({
            room: String(req.user._id) + String(doctorID._id),
            name: doctorID.name
        }));

    }
    else {
        let chats = await chatModel.find({doctorID:req.user._id}).select({_id:0,patientID:1});
        let patients = chats.map(({patientID})=>(String(patientID)));
        
        // get the doctors appointments
        let appointments = await appointmentModel.find({doctorID:req.user._id}).populate("patientID").select({_id:0,patientID:1});
        
        // filter appointments
        appointments = appointments.filter((appointment) => {
            if(patients.includes(String(appointment.patientID._id))){
                return false;
            }
            return true;
        })

        // map results
        results = appointments.map(({patientID}) => ({
            room: String(patientID._id) + String(req.user._id),
            name: patientID.name
        }));


    }
    res.status(200).json(results); 
}

const start = async (req,res) => {

    let chat = new chatModel({
        room: req.body.room,
        patientID: req.body.room.substring(0,24),
        doctorID: req.body.room.substring(24,48)
    })

    chat = await chat.save();

    res.status(200).json(chat);
}

module.exports = {chats, send, read, start, save, contacts}