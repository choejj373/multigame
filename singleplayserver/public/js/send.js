"use strict"



// const io = require("socket.io");
// const socket = io.connect("http://localhost:3001",{
//      path: "/socket.io"
// });
const socket = io();

// 매치 메이킹 요청 버튼
const sendBtn = document.querySelector("button");

// 현재 상태 표시 태그
const showMsg = document.getElementById("msg");

function send(){
    console.log( `send : ${socket}`);

    showMsg.innerText = "Wait Matching....";
    sendBtn.disabled = true;
    socket.emit( 'match' );

};

// 매칭 실패
socket.on('match-failed',()=>{
    console.log("matching failed");
    showMsg.innerText = "Matching Failed";
    sendBtn.disabled = false;
})

// 매칭 성공 - 멀티 플레이 서버로 이동
socket.on('move', function (data) {
    console.log( "move: " + data );
    window.location.href = data;
});

socket.on('error', (err)=>{
    console.log("error : ", err);
});

sendBtn.addEventListener("click", send );

