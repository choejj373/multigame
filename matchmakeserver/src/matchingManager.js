"use strict"
const socketIO = require("socket.io");
const messageQueue = require("./messageQueue");
const Client = require("./client");

class MatchingManager{
    constructor(){
        this.waitMachingClientList = [];
        this.waitRoomCreateList = new Map();
    
        this.roomId = 0;
    }

    addWaitMatchingClient( client ){
        this.waitMachingClientList.push( client );
    }

    deleteWaitRoomCreate( roomId ){
        return this.waitRoomCreateList.delete( roomId );
    }

    getWaitRoomCreate( roomId ){
        return this.waitRoomCreateList.get( roomId );
    }
};

module.exports = new MatchingManager();