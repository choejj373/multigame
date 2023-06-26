"use strict"
const socketIO = require("socket.io");
const messageQueue = require("./messageQueue");
// const Client = require("./client");

class WaitRoomCreate{
    constructor( a, b ){
        this.a = a;
        this.b = b;
    }
};

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

    updateFrame(){
        const waitClientCount = this.waitMachingClientList.length;
        const waitRoomCreateCount = this.waitRoomCreateList.size;
    
        console.log("try matching");
        console.log("wait matching client : ", waitClientCount );
        console.log("wait room created", waitRoomCreateCount );
        // console.log("MessageQueue size : ", messageQueue.size() );

        if( waitClientCount === 0 ){
            console.log("Waiting clients is none");
            return;
        }
    
        if( waitClientCount >= 2){
            
            console.log("Matching completed");
            
            const client1 = this.waitMachingClientList.shift();
            const client2 = this.waitMachingClientList.shift()
    
            const waitRoomCreate = new WaitRoomCreate( client1, client2 )
    
            this.roomId++;
    
            this.waitRoomCreateList.set( this.roomId, waitRoomCreate );
    
            //멀티 플레이 서버에 방 생성 요청
            let data = { 
                type:1, 
                roomId:this.roomId,
                clients :[
                    {
                        userId:client1.userId,
                    },
                    {
                        userId:client2.userId,
                    }
                ]
            }
            messageQueue.pushBack( data );
        }    
    }
};

module.exports = new MatchingManager();