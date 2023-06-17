"user strict"

const express = require("express");
const bodyParser = require("body-parser");


const app = express();

const homeR = require("./routes");

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended:true } ));

app.use('/', homeR);


/////////////////////////////////////////////////////////////////////////////
// 매치 메이킹 서버 접속용
const ioConnector = require("socket.io-client");
const socketConnector = ioConnector.connect("http://localhost:2002");

socketConnector.on("news",(data)=>{
    console.log(data);
    // socket.emit("reply", "hello Node.js");
});

socketConnector.on("createRoom",(data)=>{
     console.log("createRoom : " + data);
     socketConnector.emit("roomCreated", data);
});

/////////////////////////////////////////////////////////////////////////////
// 클라이언트 요청 처리 서버
const serverForClient = app.listen( 3002 ,()=>{
    console.log("multi play server listening : 3002");
});

const socketIO = require('socket.io');
const ioForClient = socketIO( serverForClient,
    { path: "/socket.io"} );

ioForClient.on('connection', (socket)=>{
    console.log( socket.id, " Connected");

    // socket.on('match', (data)=>{
    //     console.log( socket.id, " matching");
    //     socketConnector.emit("match", socket.id);
    // });

    socket.on('disconnect', ()=>{
        console.log( socket.id, " Disconnected");
    });

    socket.on('error',(err) =>{
        console.log( socket.id, err);
    });
});

