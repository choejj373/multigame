const socketIO = require('socket.io');

// const onConnection = require('./onConnection');

class WebsocketServer{

    create( httpServer ){

        this.ioForClient = socketIO( httpServer, { path: "/socket.io"} );
        this.ioForClient.on('connection', (socket)=>{

            console.log( socket.id, " Connected");

            socket.on('disconnect', ( reason )=>{
                console.log( socket.id, " Disconnected : ", reason);
                console.log( "socket rooms size : ", socket.rooms.size );
            });
        
            socket.on('error',(err) =>{
                console.log( socket.id, err);
            });
        
            // 방 접속 요청 처리
            socket.on( 'joinRoom', (data)=>{
                
                const roomManager = require('./RoomManager');

                console.log( data );
                const msg = JSON.parse( data );
                console.log( "before join - socket rooms size : ", socket.rooms.size );
                if( roomManager.joinRoom( parseInt(msg.roomId), msg.userId, socket ) ){
                    //?? size가 좀 이상한데
                    console.log( "after join - socket rooms size : ", socket.rooms.size );
                }else{
                    console.log( "not found room : ", msg.roomId );
                }
        
                
                // 성공/실패 처리 추가
            });
        } );
    }

    emitToRoom( roomId, event, ...args){
        this.ioForClient.to( roomId ).emit( event, ...args );
    }
};

module.exports = new WebsocketServer();