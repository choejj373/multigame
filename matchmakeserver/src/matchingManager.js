"use strict"
const socketIO = require("socket.io");
const messageQueue = require("./messageQueue");

class WaitRoomCreate{
    constructor( a, b ){
        this.a = a;
        this.b = b;
    }
};

class MatchingManager{
    static waitMachingClientList = [];
    static waitRoomCreateList = new Map();

    static roomID = 0;

    
    static tryMatching(){

        const waitClientCount = MatchingManager.waitMachingClientList.length;
        const waitRoomCreateCount = MatchingManager.waitRoomCreateList.size;

        console.log("try matching");
        console.log("wait matching client : ", waitClientCount );
        console.log("wait room created", waitRoomCreateCount );
        
        if( waitClientCount === 0 ){
            console.log("Waiting clients is none");
            return;
        }

        if( waitClientCount >= 2){
            
            console.log("Matching completed");
            
            const waitRoomCreate = new WaitRoomCreate( 
                MatchingManager.waitMachingClientList.shift(), 
                MatchingManager.waitMachingClientList.shift() );

            MatchingManager.roomID++

            MatchingManager.waitRoomCreateList.set( MatchingManager.roomID, waitRoomCreate );

            //멀티 플레이 서버에 방 생성 요청
            messageQueue.pushBack( { type:1, roomID:MatchingManager.roomID });
        }
    }

    constructor(){
        // this.waitMachingClientList = Array();
        // this.waitRoomCreateList = new Map();
    
        if( !MatchingManager.instance){
            MatchingManager.instance = this;
        }
        return MatchingManager.instance;
    }

    getInstance(){
        return this.instance;
    }
    // // MatchingManager.waitRoomCreateList = new Map();

    addWaitMatchingClient( client ){
        MatchingManager.waitMachingClientList.push( client );
    }

    deleteWaitRoomCreate( roomId ){
        return MatchingManager.waitRoomCreateList.delete( roomId );
    }

    getWaitRoomCreate( roomId ){
        return MatchingManager.waitRoomCreateList.get( roomId );
    }

    startMatching(){
        setInterval( MatchingManager.tryMatching, 1000 * 7 );
    }

    endMatching(){
        // clearInterval( this.tryMatching );
    }
};

module.exports = new MatchingManager();