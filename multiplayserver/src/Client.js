
class Client{
    constructor( userId ){
        this.userId = userId;
    }

    setSocketId( socketId ){
        this.socketId = socketId;
    }
}

module.exports = Client;