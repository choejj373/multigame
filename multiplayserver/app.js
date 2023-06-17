"user strict"
const io = require("socket.io-client");
const socket = io.connect("http://localhost:3001");

socket.on("news",(data)=>{
    console.log(data);
    // socket.emit("reply", "hello Node.js");
});

socket.on("matched",(data)=>{
    console.log("matched : " + data);
});

socket.emit("match");
// const net = require("net");

// function getConnection(connName){
//     let client = net.connect({port:3001, host:"localhost"}, ()=>{
//         console.log( connName + " 연결됨");
//         // console.log( `local : ${this.localAddress} / ${this.localPort}`);
//         // console.log( `remote : ${this.remoteAddress} / ${this.remotePort}`);

//         client.setTimeout(1000*60);
//         client.setEncoding("utf8");

//         client.on("data", (data)=>{
//             console.log( connName + " 한테서 데이터가 옴: " + data.toString());
//             // client.end();
//         });

//         client.on("end", ()=>{
//             console.log( connName + " disconnected");
//         });

//         client.on("error", (err)=>{
//             console.log( `error : `, JSON.stringify(err));
//         });

//         client.on("timeout", ()=>{
//             console.log("소켓 타임아웃");
//         });

//         client.on("close", ()=>{
//             console.log("소켓 닫힘");
//         });
//     });
//     return client;
// }

// function writeData( socket, data){
//     let success = !socket.write(data);
//     if(!success){
//         (function(socket, data){
//             socket.once("drain", ()=>{
//                 writeData(socket, data);
//             });
//         })(socket, data);
//     }
// }

// function sleep(ms){
//     return new Promise((r)=>setTimeout( r, ms));
// }
// async function syncSleep( ms ){
//     return await sleep( ms );
// }

// let user = getConnection("user");

// writeData( user, " 접속했음");

// syncSleep(5000);

// user.end();

// console.log("client exit");
