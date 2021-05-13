const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    roomID : {type: String, required: true},
    senderID : {type: String, required: true},
    reciverID : {type: String, required: true},
    txtmsg: {type: String, required: true},
    time: {type: String, default: Date.now},
});

module.exports = mongoose.model('Messages', MessagesSchema);