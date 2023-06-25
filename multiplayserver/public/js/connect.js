"use strict"

// const socket = io();
let socket = io.connect('http://localhost:3002',
{
    path: '/socket.io',
    transports: ['websocket']
});

const joinBtn = document.getElementById("join")
//console.log( `send : ${socket}`);
// socket.emit( 'match' );

socket.on('error', (err)=>{
    console.log("error : ", err);
});

socket.on('ready', (data)=>{
    console.log("gameready")
});

socket.on('gamestart', (date)=>{
    console.log("gamestart")
});

socket.on('gameend', (date)=>{
    console.log("gameend")
});

function joinRoom(){

    const userId = document.getElementById("userId").value;
    const roomId = document.getElementById("roomId").value;

    console.log( userId )
    const msg = {
        userId : userId,
        roomId : roomId,
    }

    console.log( msg );
    socket.emit( 'joinRoom', JSON.stringify( msg ));
    console.log('clicked');
}

joinBtn.addEventListener('click', joinRoom);