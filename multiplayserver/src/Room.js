const Client = require('./Client');

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

        return true;
    }
    
    startReady(){
        this.state = 'ready';
        this.timeStartReady = Date.now();

        console.log( `room:${this.roomId} - this.timeStartReady` );

        const websocketServer = require('./WebsocketServer');
        websocketServer.emitToRoom( this.roomId, 'gameready' );

        setTimeout( ()=>{this.startGame()}, 5000 );
    }

    startGame(){
        this.state = 'playing';
        this.timeStart = Date.now();

        const websocketServer = require('./WebsocketServer');
        websocketServer.emitToRoom( this.roomId, 'gamestart' );

        this.tableBoss.forEach( (value, key)=>{
            setTimeout( ()=>{
                websocketServer.emitToRoom( this.roomId, 'bossappear' , value , this.objId++ );
            }, 
            key);
        });

        setTimeout( ()=>{this.endGame()}, 20000 );
    }
    
    endGame(){
        this.state = 'end';
        this.timeEnd = Date.now();

        const websocketServer = require('./WebsocketServer');
        websocketServer.emitToRoom( this.roomId, 'gameend' );
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
   
}

module.exports = Room;