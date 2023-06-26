const Room = require('./Room');


class RoomManager{

    constructor(){
        this.waitClientJoinRooms = new Map();
        this.playingRooms = new Map();
        
    }
    // 매치 메이킹 서버에서 받은 룸 생성 요청 처리
    createRoom( roomId, clients ){
        if( this.waitClientJoinRooms.has( roomId )){
            console.error("roomId is exist : ", roomId );
            return false;
        }

        const newRoom = new Room(roomId, clients);
        this.waitClientJoinRooms.set( roomId, newRoom );
        return true;
    }

    // 룸에 접속, 접속 성공시 io.socket.join 해주자
    joinRoom( roomId, userId, socketId ){

        if( !this.waitClientJoinRooms.has( roomId ) ){
            console.warn( "not found waiting room : ", roomId );
            return false;

        }

        const room = this.waitClientJoinRooms.get( roomId );
        if( !room.join( userId, socketId ) ){
            console.warn(" fail join room : ", roomId );
            return false;
        }


        // 모든 클라이언트가 접속 완료 되었다면
        if( room.isFull() ){
            this.waitClientJoinRooms.delete( roomId );
            room.startReady();
            this.playingRooms.set( roomId, room );
        }

        return true;
    }

    // waitClientJoinRooms 중 일정 시간동안 모든 클라이언트가 꽉차지 않는다면
    // 삭제하거나 시작한다.
    updateFrame(){
        // console.log( "waitClientJoinRooms : ", this.waitClientJoinRooms.size);
        // console.log( "playingRooms : ", this.playingRooms.size);

        let gameEndRooms = [];
        this.playingRooms.forEach(( value, key )=>{
            value.updateFrame();
            if( value.isGameEnd()){
                gameEndRooms.push( key );
            }
        })

        gameEndRooms.forEach( ( roomId )=>{
            this.playingRooms.delete( roomId );
            console.log("Delete GameEnd Room : ", roomId );
        })

    }
}

module.exports = new RoomManager();