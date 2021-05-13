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
    });
};