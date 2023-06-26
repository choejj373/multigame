"use strict"

const express = require("express");
const matchingManager = require("./src/matchingManager");
const Client = require("./src/client");

const messageQueue = require("./src/messageQueue");

// for multiplayserver
const app2 = express();
const server2 = app2.listen(2002,()=>{
    console.log("server for multigameserver - listening:2002");
});

const socketIO = require("socket.io");
const ioMulti = socketIO( server2 );

ioMulti.on('connection', (socket)=>{
    // socketMulti = socket;
    console.log("multi play server is conneted")

    socket.on('disconnect',()=>{
        console.log('client is disconnected');
    });

    socket.on('error', (error)=>{
        console.log(error);
    });

    socket.on('reply', (data)=>{
        console.log(data);
    });

    socket.on('roomCreated', (data)=>{
        console.log("roomCreated");
        messageQueue.pushBack( {type:2, roomId:data});
    });

});
// for singleplayserver
const app = express();
const server = app.listen(2001,()=>{
    console.log("server for singlegameserver - listening:2001");
});

const ioSingle = socketIO( server );

ioSingle.on('connection', (socket)=>{
   
    console.log("single play server is conneted")

    socket.on('disconnect',()=>{
        console.log('client is disconnected');
    });

    socket.on('error', (error)=>{
        console.log(error);
    });

    socket.on('reply', (data)=>{
        console.log(data);
    });

    socket.on('match', (data)=>{
        console.log('matching : ' + data);

        const msg = JSON.parse( data );
        const client = new Client( msg.userId, msg.socketId );

        matchingManager.addWaitMatchingClient( client );

    });
});




function processMessage(){

    const msg = messageQueue.popFront();
    if( msg )
    {
        console.log( "process msg - ",msg );
        switch( msg.type )
        {
        case 1:// multi play server에 방 생성 요청
            try{

                const data = {
                    roomId: msg.roomId,
                    clients :[
                        {
                            userId:msg.clients[0].userId,
                        },
                        {
                            userId:msg.clients[1].userId,
                        }
                    ]
                }
                ioMulti.emit( "createRoom", JSON.stringify(data) );
            }catch( err ){
                console.log( err );
                messageQueue.pushBack( msg );
            }
            break;
        case 2:// 방생성 완료
            const result = matchingManager.getWaitRoomCreate( msg.roomId );
            console.log( result );

            if( result ){
                // 싱글 서버에 방 생성 알려 클라이언트 이동하게함 - 그전에 매칭 요청시 받은 socketID 저장해두어야 한다.
                try{
                    ioSingle.emit( "matched", 
                        JSON.stringify({ socketId:result.a.socketClient, userId:result.a.userId} ));
                    ioSingle.emit( "matched", 
                        JSON.stringify({ socketId:result.b.socketClient, userId:result.b.userId} ));

                }catch(err){
                    console.error( err );
                }
                
                matchingManager.deleteWaitRoomCreate( msg.roomId );
            }else{
                console.error("not found roomID - ", msg.roomId );
            }

            break;
        default:
            break;

        }
    }  
};

function tryMatching(){
    matchingManager.updateFrame();
}

setInterval( processMessage, 1000 );
setInterval( tryMatching, 1000 * 5);
