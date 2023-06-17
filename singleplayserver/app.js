"user strict"

const express = require("express");


// 매치 메이킹 서버 접속용
const io = require("socket.io-client");
const socket = io.connect("http://localhost:2001");

socket.on("news",(data)=>{
    console.log(data);
    // socket.emit("reply", "hello Node.js");
});

socket.on("matched",(data)=>{
    console.log("matched : " + data);
    // 클라이언트에게 멀티플레이 서버로 접속
});

socket.emit("match");

// 클라이언트 요청 처리 서버
const app = express();
const server = app.listen( 3001 ,()=>{
    console.log("single play server listening : 3001");
});
