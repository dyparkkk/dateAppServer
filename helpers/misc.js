const Chats = require('../schemas/chats');
const { v4: uuidV4 } = require('uuid');
const socket = require('../socket');
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
        }
    }
};

const loadMessages = (socket) => {
    socket.on('sentMsgs', async(myID)=>{
        const msg = await Messages.find({senderID: myID});
        if(!msg) return null;
        return msg;

    } );

    socket.on('recievedMsgs', async(myID)=> {
        const msg = await Messages.find({recieverID: myID});
        if(!msg) return null;
        return msg;
    });
};

module.exports = {addUser, loadMessages}; 