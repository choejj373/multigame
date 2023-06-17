"use strict"

const socket = io();

//console.log( `send : ${socket}`);
// socket.emit( 'match' );

socket.on('error', (err)=>{
    console.log("error : ", err);
});