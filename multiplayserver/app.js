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



const roomManager = require('./src/RoomManager');
const messageQueue = require('./src/MessageQueue');

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

     if( roomManager.createRoom( roomId, clients ) ){
        socketConnector.emit("roomCreated", data);
     }else{
        //방 생성 실패 알림
     }
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

    // 방 접속 요청 처리
    socket.on( 'joinRoom', (data)=>{
        console.log( data );
        const msg = JSON.parse( data );
        if( roomManager.joinRoom( parseInt(msg.roomId), msg.userId, socket.id ) ){
            // socket room에 조인
            socket.join( parseInt(msg.roomId) );

            //?? size가 좀 이상한데
            console.log( "socket rooms size : ", socket.rooms.size );
        }
        
        // 성공/실패 처리 추가
    });

    socket.on('disconnect', ()=>{
        console.log( socket.id, " Disconnected");
        console.log( "socket rooms size : ", socket.rooms.size );
    });

    socket.on('error',(err) =>{
        console.log( socket.id, err);
    });
});
/**--------------------------------------------------------------------*/
// For Test
// const clients1 = [
//     {
//         userId : 'choejj1'
//     },
//  ]
// const roomId1 = 1;
// roomManager.createRoom( roomId1, clients1 );

// const clients2 = [
//     {
//         userId : 'choejj2'
//     },
//  ]
// const roomId2 = 2;
// roomManager.createRoom( roomId2, clients2 );

/**--------------------------------------------------------------------*/
// 클래스간 의존성을 낮추기 위하여 별도의 메세지 큐를 두었다.
function processMessage(){
    const msg = messageQueue.popFront();
    if( msg ){
        console.log( "Process Message : ", msg.type );
        switch( msg.type )
        {
        case 1:
            ioForClient.to( msg.roomId ).emit( 'ready' );
            // ioForClient.emit( 'ready' );
            break;
        case 2:
           ioForClient.to( msg.roomId ).emit( 'gamestart' );
            // ioForClient.emit( 'gamestart' );
              
            break;
        case 3:
            ioForClient.to( msg.roomId ).emit( 'gameend' );
            // ioForClient.emit( 'gameend' );
            break;
        }
    }
}

function updateFrame(){
    processMessage();
    roomManager.updateFrame();
}

setInterval( updateFrame, 1000 );