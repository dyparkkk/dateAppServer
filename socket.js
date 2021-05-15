const {addUser, loadMessages} = require('./helpers/misc');
const Messages = require('./schemas/messages');
const User = require('./schemas/user');

module.exports = (io)=>{
    io.on('connection', (socket) => {
        console.log("socket connected");
        const req = socket.request;
        // console.log(req);
        // get uses
        socket.on('getUsers', async()=> {
            const users = await User.find({});
            io.emit('getAllUsers', users);
        });

        loadMessages(socket); 

        socket.on('oneToOneChat', ({recieverID, senderID, recieverName}, callback) => {
            console.log("oneToOneChat");
            addUser({recieverID, senderID, recieverName}, socket);

        });

        socket.on('joinTwoUsers', async({roomID})=> {
            await socket.join(roomID);
        })

        socket.on('sendToUser', (data)=>{
            socket.broadcast.to(data.roomID).emit('dispatchMsg', {...data});

            const {
                roomID,
                senderID,
                recieverID,
                composeMsg: {time, txtmsg},
            } = data;

            new Messages({
                roomID,
                senderID,
                recieverID,
                time,
                txtmsg,
            }).save();
        });
    });
};