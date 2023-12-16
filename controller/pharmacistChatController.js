const pharmacistChatModel = require("../model/pharmacistChat");

const pharmacistChat = async (req, res) => {
    let chat = await pharmacistChatModel.findOne({ doctorID: req.user._id });

    let count = 0;
    for (let i = 1; i <= chat.messages.length; i++) {
        if (chat.messages[chat.messages.length - i].unread && !chat.messages[chat.messages.length - i].isDoctor) {
            count++;
        }
        else {
            break;
        }
    }

    let result = {
        doctorID: chat.doctorID,
        messages: chat.messages,
        unread:count
    }

    res.status(200).json(result);
}

const pharmacistSave = async ({ room, text, time }) => {
    let chat = await pharmacistChatModel.findOne({ doctorID: room });

    let message = {
        text,
        date: new Date(time),
        isDoctor: true
    }

    chat.messages.push(message);

    chat.unreadPharmacist = 1 + chat.unreadPharmacist;

    chat.save();
}

const pharmacistRead = async (req, res) => {
    let chat = await pharmacistChatModel.findOne({ doctorID: req.user._id });

    for (let i = 1; i <= chat.messages.length && !chat.messages[chat.messages.length - i].isDoctor && chat.messages[chat.messages.length - i].unread; i++) {
        chat.messages[chat.messages.length - i].unread = false;
    }

    chat.unreadDoctor = 0;

    chat.save();
    res.status(200).json({ chat });
}

const pharmacistStart = async (id) => {
    let chat = new pharmacistChatModel({
        doctorID: id
    })

    chat = await chat.save();
    return chat;
}


module.exports = { pharmacistChat, pharmacistRead, pharmacistSave, pharmacistStart }