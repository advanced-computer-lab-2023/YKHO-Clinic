const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    doctorID: { type:mongoose.Schema.Types.ObjectId },
    patientID: { type:mongoose.Schema.Types.ObjectId },
    read: { type: Boolean, required: true },
    text: { type: String, required: true },
    date: {type: Date, required: true},
});

const notification = mongoose.model("Notification", notificationSchema);

module.exports = notification;