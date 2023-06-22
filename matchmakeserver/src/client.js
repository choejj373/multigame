"use strict"

class Client{
    // #socketClient;
    // #socketSingleServer;

    constructor(socketClient, socketSingleServer)
    {
        this.socketClient = socketClient;
        this.socketSingleServer = socketSingleServer;
    }

    getSocketClient(){ return this.socketClient;}
    getSocketSingleServer(){ return this.socketSingleServer;}
};

module.exports = Client;