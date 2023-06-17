"user strict"

const express = require("express");

// 클라이언트 요청 처리 서버
const app = express();
const serverForClient = app.listen( 3001 ,()=>{
    console.log("single play server listening : 3001");
});

const socketIO = require('socket.io');
const ioForClient = socketIO( serverForClient );

// 매치 메이킹 서버 접속용
const ioConnector = require("socket.io-client");
const socketConnector = ioConnector.connect("http://localhost:2001");

/////////////////////////////////////////////////////////////////////////////
//
socketConnector.on("news",(data)=>{
    console.log(data);
    // socket.emit("reply", "hello Node.js");
});

socketConnector.on("matched",(data)=>{
    console.log("matched : " + data);
    // 클라이언트에게 멀티플레이 서버로 접속
    // ioForClient.sockets.socket(data).emit("move","http://localhost:3002");
    
});

/////////////////////////////////////////////////////////////////////////////
//
ioForClient.on('connection', (socket)=>{
    console.log( socket.id, " Connected");
});

ioForClient.on('match', (socket)=>{
    console.log( socket.id, " matching");
    socketConnector.emit("match", socket.id);
});

ioForClient.on('disconnect', ()=>{
    console.log( socket.id, " Disconnected");
});