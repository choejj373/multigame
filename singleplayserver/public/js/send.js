"use strict"



// const io = require("socket.io");
// const socket = io.connect("http://localhost:3001",{
//      path: "/socket.io"
// });
const socket = io();

const sendBtn = document.querySelector("button");

function send(){
    console.log( `send : ${socket}`);
    socket.emit( 'match' );
};

socket.on('move', function (data) {
    console.log( "matched msg: " + data );
    window.location.href = data;
});

socket.on('error', (err)=>{
    console.log("error : ", err);
});

sendBtn.addEventListener("click", send );

