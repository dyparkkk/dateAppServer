const {addUser, loadMessages} = require('./modules/misc');
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

        socket.on('joinTwoUsers', async(roomID)=> {
            console.log("join room !!")
            await socket.join(roomID);
            console.log(`roomID : ${roomID}`);
        })

        socket.on('sendToUser', (data)=>{
            msg = socket.broadcast.to(data.roomID).emit('dispatchMsg', {...data});
            console.log("dispatch", msg);
            const {
                roomID,
                senderID,
                recieverID,
                time,
                txtmsg,
            } = data;

            new Messages({
                roomID,
                senderID,
                recieverID,
                time,
                txtmsg,
            }).save();
            console.log(`send message from ${data.senderID} to ${recieverID}`);
        });
    });
};