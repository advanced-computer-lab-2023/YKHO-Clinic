const mongoose = require('mongoose');
const {doctor}= require("./doctor");
const timeslotSchema = new mongoose.Schema({
day: {
    type: String,
    required: true,
    enum: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    lowercase: true,
    trim: true,
},
from: {
    type: String,
    required: true,
},
to: {
    type: String,
    required: true,
},
doctorID:
{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:doctor
}
});
const timeSlot = mongoose.model('timeSlot', timeslotSchema);
module.exports={timeSlot};