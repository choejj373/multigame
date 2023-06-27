/*const roomManager = require('./RoomManager');

function onConnection( socket ){
    
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
        console.log( data );
        const msg = JSON.parse( data );
        if( roomManager.joinRoom( parseInt(msg.roomId), msg.userId, socket.id ) ){
            // socket room에 조인
            socket.join( parseInt(msg.roomId) );

            //?? size가 좀 이상한데
            console.log( "socket rooms size : ", socket.rooms.size );
        }else{
            console.log("not found room : ", msg.roomId );
        }

        
        // 성공/실패 처리 추가
    });
}

module.exports = onConnection;*/