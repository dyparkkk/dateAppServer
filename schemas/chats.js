const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChatSchema = new Schema({
    roomID : {type: String, required: true},
    senderID : {type: String, required: true},
    recieverID : {type: String, required: true},
    time: {type: String, default: Date.now},
});

module.exports = mongoose.model('chats', ChatSchema);