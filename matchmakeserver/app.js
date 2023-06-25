"use strict"

const express = require("express");
const matchingManager = require("./src/matchingManager");
const Client = require("./src/client");

// let socketSingle, socketMulti;
// const matchingManager = MatchingManager;
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
        messageQueue.pushBack( {type:2, roomID:data});
    });

});
// for singleplayserver
const app = express();
const server = app.listen(2001,()=>{
    console.log("server for singlegameserver - listening:2001");
});

// const socketIO = require("socket.io");
const ioSingle = socketIO( server );

ioSingle.on('connection', (socket)=>{
    
    // socketSingle = socket;

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
        const client1 = new Client(data,0);
        matchingManager.addWaitMatchingClient( client1 );
        // try{
        //     socketMulti.emit("createRoom", data);
        // }
        // catch( err )
        // {
        //     console.log( err );
        //     socket.emit('match-failed', data);
        // }
    });
});




function updateFrame(){
    console.log("updateFrame");
    const msg = messageQueue.popFront();
    if( msg )
    {
        console.log( "process msg - ",msg );
        switch( msg.type )
        {
        case 1:// multi play server에 방 생성 요청
            try{
                ioMulti.emit( "createRoom", msg.roomID );
            }catch( err ){
                console.log( err );
                messageQueue.pushBack( msg );
            }
            break;
        case 2:// 방생성 완료
            const result = matchingManager.getWaitRoomCreate( msg.roomID );
            console.log( result );

            if( result ){
                // 싱글 서버에 방 생성 알려 클라이언트 이동하게함 - 그전에 매칭 요청시 받은 socketID 저장해두어야 한다.
                try{
                    ioSingle.emit( "matched", result.a.socketClient );
                    console.log( result.a );
                    ioSingle.emit( "matched", result.b.socketClient );
                    console.log( result.b.socketClient );

                }catch(err){
                    console.error( err );
                }
                
                matchingManager.deleteWaitRoomCreate( msg.roomID );
            }else{
                console.error("not found roomID - ", msg.roomID );
            }

            break;
        default:
            break;

        }
    }else{
        console.log("message queue is empty");
    }
   
};


// const client1 = new Client(0,0);
// matchingManager.addWaitMatchingClient( client1 );

// const client2 = new Client(1,0);
// matchingManager.addWaitMatchingClient( client2 );


setInterval( updateFrame, 1000 );
// setInterval( MatchingManager.tryMatching, 1000 * 7 );
matchingManager.startMatching();

module.exports = messageQueue;
