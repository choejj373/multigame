"user strict"

const express = require("express");


// 매치 메이킹 서버 접속용
const io = require("socket.io-client");
const socket = io.connect("http://localhost:2002");

socket.on("news",(data)=>{
    console.log(data);
    // socket.emit("reply", "hello Node.js");
});

socket.on("createRoom",(data)=>{
     console.log("createRoom : " + data);
     socket.emit("roomCreated", data);
});

// 클라이언트 요청 처리 서버
const app = express();
const server = app.listen( 3002 ,()=>{
    console.log("multi play server listening : 3002");
});

