const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    doctorID: { type: String },
    patientID: { type: String },
    text: { type: String, required: true },
    date: {type: Date, required: true},
});

const notification = mongoose.model("Notification", notificationSchema);

module.exports = notification;