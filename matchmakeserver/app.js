"use strict"

const express = require("express");

let socketSingle, socketMulti;

// for multiplayserver
const app2 = express();
const server2 = app2.listen(2002,()=>{
    console.log("server for multigameserver - listening:2002");
});

const socketIO = require("socket.io");
const io2 = socketIO( server2 );

io2.on('connection', (socket)=>{
    socketMulti = socket;
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
        socketSingle.emit("matched");
    });

});
// for singleplayserver
const app = express();
const server = app.listen(2001,()=>{
    console.log("server for singlegameserver - listening:2001");
});

// const socketIO = require("socket.io");
const io = socketIO( server );

io.on('connection', (socket)=>{
    
    socketSingle = socket;

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
        socketMulti.emit("createRoom");
        // socket.emit('matched');
    });

    // socket.emit('news', 'Hellow Socket.IO');
});



// const net = require("net");
// let sockets = [];

// const server = net.createServer( (client)=>{
//     client.setEncoding("utf8");
//     client.setTimeout(1000*60);
//     client.on("data",(data)=>{
//         console.log("data received :" + data);
//         for(let i = 0; i < sockets.length;i++){
//             sockets[i].write(data);
//         }
//     });

//     client.on("error", ()=>{
//         console.log("error");
//     });

//     client.on("close", ()=>{
//         sockets.pop();
//         console.log("client closed");
//     });
//     client.on("timeout",()=>{
//         console.log("timeout");
//     });
//     client.write("hello");
//     sockets.push(client);
// });

// server.on("error", (error)=>{
//     console.log("server error");
// });

// server.on("listening",()=>{
//     console.log("server listening");
// })

// server.listen(3001, ()=>{
//     let serverInfo = server.address();
//     let serverInfoJson = JSON.stringify(serverInfo);
//     console.log("listen server : " + serverInfoJson );
//     server.on("error",()=>{
//         console.log("server error");
//     })
//     server.on("close", ()=>{
//         console.log("server closed");
//     });
//     server.on("connection", ()=>{
//         console.log("client connected");
//     });
// });
