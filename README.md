# 멀티 플레이 게임을 위한 서버간 통신 및 이동
+ websocket(socket.io) 사용
    + net module 사용시 tcp stream 처리가 필요;
    + 성능 이슈만 없다면 충분히 구현 가능, 보안 강화도 필요
    
+ 매치메이킹 서버
    + 싱글 플레이 서버에서 요청을 받아 정해진 룰로 매칭후 멀티 플레이 서버에 방생성
    + 멀티 플레이 서버에서 방생성 완료 되면 싱글 플레이 서버를 통하여 클라이언트에게 이동 알림
    + 간단한 매치 메이킹 
        + 조건 없이 2명 이상이 매칭 대기 상태라면 매칭 완료

+ 멀티 플레이 서버
    + 매치 메이킹 서버로 부터 방생성을 요청 받아 방 생성후 매치메이킹 서버에 알림

    + 간단한 멀티 플레이 게임( pve )
        + 대기중인 모든 클라이언트가 접속시 게임 ready
        + 일정 시간후 게임 start
        + npc 등장은 서버에서 클라이언트에게 알림
            + 중간 보스 생성( 일정 시간후 ) 
            + 스테이지 보스 생성( 일정 시간후 ) 
            + 보스는 클라이언트 요청으로 죽이고 해당 보상 부여 가능( todo )
                + 보스 나올때 Map에 넣어두자.
            + 잡몹은 ( todo )

        + 일정 시간후 게임 end

    + 클라이언트 접속
        + 임시 키 발급으로 보안 강화( todo )
        + 모두 접속하지 않을때 처리( todo )


+ 싱글 플레이 서버 => practice 프로젝트 서버로 교체 기존 서버는 테스트용으로
    + 클라이언트 로그인 및 싱글 플레이 담당
    + 매치 메이킹 서버에 매칭 요청
    + 매칭 관련 응답을 클라이언트에게 보내기 위해 websocket 연결 하고 있어야 함.

+ 작업중
    + 간단한 멀티 플레이 게임 구현

+ TODO
    + 실질적인 매치 메이킹 로직 구현 필요
        + pve, pvp 혹은 기획에 따라 여러가지 방법이 있음

    + 서버가 2개 이상일 경우 처리 필요
        + 싱글 플레이 서버나 멀티 플레이 서버가 2대 이상일 경우