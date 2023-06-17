"user strict"

const express = require("express");
const bodyParser = require("body-parser");

// 클라이언트 요청 처리 서버
const app = express();
/////////////////////////////////////////////////////////////////////////////
//

const home = require("./routes");
 app.set("views", "./views");
 app.set("view engine", "ejs");

 app.use(express.static(`${__dirname}/public`));
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded( { extended:true } ));

 app.use('/', home);
/////////////////////////////////////////////////////////////////////////////
//

const serverForClient = app.listen( 3001 ,()=>{
    console.log("single play server listening : 3001");
});

const socketIO = require('socket.io');
const ioForClient = socketIO( serverForClient,
    { path: "/socket.io"} );

// 매치 메이킹 서버 접속용
const ioConnector = require("socket.io-client");
const socketConnector = ioConnector.connect("http://localhost:2001");

/////////////////////////////////////////////////////////////////////////////
//
socketConnector.on("news",(data)=>{
    console.log(data);
});

socketConnector.on("matched",(data)=>{
     console.log("matched : " + data);
     // 클라이언트에게 멀티플레이 서버로 접속
     ioForClient.to(data).emit("move","http://localhost:3002");
  
});

/////////////////////////////////////////////////////////////////////////////
//
ioForClient.on('connection', (socket)=>{
    console.log( socket.id, " Connected");

    socket.on('match', (data)=>{
        console.log( socket.id, " matching");
        socketConnector.emit("match", socket.id);
    });

    socket.on('disconnect', ()=>{
        console.log( socket.id, " Disconnected");
    });

    socket.on('error',(err) =>{
        console.log( socket.id, err);
    });
});
/////////////////////////////////////////////////////////////////////////////
//
