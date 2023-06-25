const Client = require('./Client');
const messageQueue = require('./MessageQueue');

class Room{
    
    constructor( roomId, clients ){

        this.waitJoinClients = new Map();
        this.joinedClients = new Map();

        // waitClientJoin, ready, playing;
        // this.state = 'waitClientJoin';
        this.roomId = roomId;

        console.log( clients );

        clients.forEach(element => {
            console.log( element );
            const newCli = new Client( element.userId );
            this.waitJoinClients.set( newCli.userId, newCli );
        });
    }

    join( userId, socketId ){

        if( !this.waitJoinClients.has( userId )){
            console.log("not found waiting user : ", userId );
            return false;
        }

        const client = this.waitJoinClients.get( userId );

        client.setSocketId( socketId );

        this.joinedClients.set( client.userId, client );
        this.waitJoinClients.delete( client.userId );

        return true;

    }
    
    startReady(){
        this.state = 'ready';
        this.timeStartReady = Date.now();
        console.log( this.timeStartReady );

        // io.to( roomId ) 에 ready 알림
        messageQueue.pushBack( { type:1, roomId : this.roomId });
    }

    startGame(){
        this.state = 'playing';
        this.timeStart = Date.now();
        // io.to( roomId ) 에 start 알림
        messageQueue.pushBack( { type:2, roomId : this.roomId });
    }
    
    endGame(){
        this.state = 'end';
        this.timeEnd = Date.now();
        // io.to( roomId ) 에 start 알림
        messageQueue.pushBack( { type:3, roomId : this.roomId });
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
                if( Date.now() - this.timeStart >= 1000 * 5 ){
                    this.endGame();
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