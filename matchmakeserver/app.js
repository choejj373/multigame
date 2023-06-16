"use strict"

const express = require("express");

const app = express();

const server = app.listen( 3001,()=>{
    console.log("서버 시작");
} );

const io = SocketIO( server, {path: "socket.io" } );

io.on("connection", function( socket ){
    console.log( socket.id, " connected...");

    socket.on("disconnect", (data)=>{
        console.log( socket.id, " disconnected");
    })
});
