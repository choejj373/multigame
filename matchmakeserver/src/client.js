"use strict"

class Client{
    // #socketClient;
    // #socketSingleServer;

    constructor( userId, socketClient )
    {
        this.userId = userId;
        this.socketClient = socketClient;
    }
};

module.exports = Client;