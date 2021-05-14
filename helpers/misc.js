const addUser = ({recieverID, senderID }, socket)=> {
    if(!recieverID || !senderID){
        return {error: "User are required"};
    }


    const user = {recieverID, senderID};
};

module.exports = {addUser}; 