const Chats = require('../schemas/chats');
const { v4: uuidV4 } = require('uuid');
// const socket  require('../socket');
const Messages = require('../schemas/messages');

const addUser = async({recieverID, senderID }, socket)=> {
    if(!recieverID || !senderID){
        return {error: "User are required"};
    }

    const user = {recieverID, senderID};

    const chat = await Chats.aggregate([
        {
            $match: {
                recieverID,
                senderID,
            },
        },
    ]);
    console.log(chat);
    if(chat.length > 0){
        socket.emit('openChat', { ...chat[0] });
    } else {
        lastAttempt = await Chats.aggregate([
            {
                $match: {
                    recieverID: senderID,
                    senderID: recieverID
                }
            }
        ]);
        if(lastAttempt > 0){
            socket.emit('openChat', { ...lastAttempt });
        } else{
            const newChat = {
                ...user,
                roomID: uuidV4()
            }

            socket.emit('openChat', newChat);
            // store newChat
            new Chats(newChat).save();
            console.log("create new Chat ", newChat);
        }
    }
};

const loadMessages = (socket)=> {     //async(socket, io) => {
    socket.on('sentMsgs', async(chatData, cb)=>{
        const {myID, roomID} = chatData;
        const sentMsg = await Messages.find({senderID: myID, roomID:roomID}).sort({"time":1});
        console.log("sentMsgs: ");
        if(!sentMsg) return cb(null);
        cb(sentMsg);
    });

    socket.on('recievedMsgs', async(chatData, cb)=> {
        const {myID, roomID} = chatData;
        console.log(chatData);
        const recievedMsg = await Messages.find({recieverID: myID, roomID:roomID}).sort({"time":1});
        console.log("recievedMsgs");
        console.log(recievedMsg);
        if(!recievedMsg) return cb(null);
        return cb(recievedMsg);
    });
};

module.exports = {addUser, loadMessages}; 