const Client = require('./Client');
// const messageQueue = require('./MessageQueue');

// const socketIO = require('socket.io');

class Room{
    
    constructor( roomId, clients ){

        this.waitJoinClients = new Map();
        this.joinedClients = new Map();

        this.roomId = roomId;
        this.objId = 1;

        console.log( clients );

        clients.forEach(element => {
            console.log( element );
            const newCli = new Client( element.userId );
            this.waitJoinClients.set( newCli.userId, newCli );
        });

        // 게임중에 나올 보스들 정보
        this.tableBoss = new Map();
        this.tableBoss.set( 1000 * 5, 1 );
        this.tableBoss.set( 1000 * 10, 1 );
        this.tableBoss.set( 1000 * 15, 2 );
    }

    join( userId, socket ){

        if( !this.waitJoinClients.has( userId )){
            console.log("not found waiting user : ", userId );
            return false;
        }

        const client = this.waitJoinClients.get( userId );

        client.setSocketId( socket.id );

        this.joinedClients.set( client.userId, client );
        this.waitJoinClients.delete( client.userId );

        socket.join( this.roomId );

        
        //const websocketServer = require('./WebsocketServer');
        //console.log( websocketServer.ioForClient.sockets.clients( this.roomId ));
        return true;

    }
    
    startReady(){
        this.state = 'ready';
        this.timeStartReady = Date.now();
        console.log( `room:${this.roomId} - this.timeStartReady` );

        // io.to( roomId ) 에 ready 알림
        // messageQueue.pushBack( { type:1, roomId : this.roomId });
        const websocketServer = require('./WebsocketServer');
        websocketServer.ioForClient.to( this.roomId ).emit( 'gameready' );
        // websocketServer.ioForClient.emit( 'gameready' );        
    }

    startGame(){
        this.state = 'playing';
        this.timeStart = Date.now();
        // io.to( roomId ) 에 start 알림
        // messageQueue.pushBack( { type:2, roomId : this.roomId });
        const websocketServer = require('./WebsocketServer');
        websocketServer.ioForClient.to( this.roomId ).emit( 'gamestart' )
    }
    
    endGame(){
        this.state = 'end';
        this.timeEnd = Date.now();
        // io.to( roomId ) 에 start 알림
        // messageQueue.pushBack( { type:3, roomId : this.roomId });
        const websocketServer = require('./WebsocketServer');
        websocketServer.ioForClient.to( this.roomId ).emit( 'gameend' );
    }

    updateGame( elapsedTime ){
        if( this.tableBoss.size <=0 ){ return ;}

        let keys = [];
        
        const websocketServer = require('./WebsocketServer');

        this.tableBoss.forEach( (value, key)=>{
                if( key <= elapsedTime )
                {
                    keys.push( key );
                    websocketServer.ioForClient.to( this.roomId ).emit( 'bossappear' , value , this.objId++ );
                }
            }
        )

        for( let key of keys ){
            this.tableBoss.delete( key );
        }
    }

    isGameEnd(){
        if( this.state == 'end'){ return true; }
        return false;
    }

    isFull()
    {
        if( this.waitJoinClients.size <= 0 ){ return true; }
        return false;
    }

    updateFrame(){
        console.log( `roomId : ${this.roomId}, state:${this.state}` );
        switch( this.state ){
            case 'ready':
                //ready 상태가 가 5초 지났다면 실제 게임 시작
                if( Date.now() - this.timeStartReady >= 1000 * 5 ){
                    this.startGame();
                }
                break;
                //playing 상태가 10 초 지나면 게임 끝
            case 'playing':
                const elapsedTime = Date.now() - this.timeStart;
                if(  elapsedTime >= 1000 * 20 ){
                    this.endGame();
                }else{
                    this.updateGame( elapsedTime );
                }
                // 게임 플레이 진행
                break;
            default:
                console.log( 'default');
                break;
        }
    }

    
}

module.exports = Room;