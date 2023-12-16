const mongoose = require('mongoose');
const { doctor } = require("./doctor");

const messageSchema = {
    text: {
        type: String,
    },
    date: {
        type: Date,
    },
    isDoctor: {
        type: Boolean,
    },
    unread: {
        type: Boolean,
        default: true
    }
}

const pharmacistChatSchema = new mongoose.Schema({
    doctorID:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: doctor
    },
    messages: [messageSchema],
}, { timestamps: true })

const PharmacistChat = mongoose.model('pharmacistChat', pharmacistChatSchema);
module.exports = PharmacistChat;