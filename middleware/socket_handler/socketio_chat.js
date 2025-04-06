const chatService = require('../../services/chat.service');

module.exports = (socket, userSockets) => {
    // 채팅방 입장 처리 - 채팅방 목록에서 채팅방 입장
    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`📌 사용자 ${socket.id}가 채팅방 ${roomId}에 입장했습니다.`);
    });

    // 채팅방 생성 또는 찾기 요청 처리 - 친구창에서 친구 선택해서 채팅방 생성 또는 찾기
    socket.on("create_or_join_chat", async (data) => {
        try {
            // 채팅방 생성 또는 찾기
            const room = await chatService.findOrCreateChatRoom({
                body: {
                    userEmail: data.userEmail,
                    friendEmail: data.friendEmail
                }
            });

            // 채팅방 자동 입장
            socket.join(room.roomId);



            // 채팅방 정보 응답
            socket.emit("chat_created", room);

            console.log(`📌 사용자 ${data.userEmail}와 ${data.friendEmail} 간의 채팅방 생성/조회 완료`);
        } catch (err) {
            console.error('채팅방 생성 오류:', err);
            socket.emit("error", { message: "채팅방 생성에 실패했습니다." });
        }
    });

    // 채팅 메시지 전송 처리
    socket.on("send_message", async (data) => {
        try {
            // 데이터 유효성 검사
            if (!data.roomId || !data.sender || !data.content) {
                throw new Error("필수 메시지 정보가 누락되었습니다.");
            }

            // 메시지 저장
            const savedMessage = await chatService.saveMessage({
                roomId: data.roomId,
                sender: data.sender,
                content: data.content
            });

            // 채팅방의 모든 참여자에게 메시지 브로드캐스트
            socket.to(data.roomId).emit("new_message", {
                roomId: data.roomId,
                message: savedMessage
            });

            // 메시지 전송 확인 응답
            socket.emit("message_sent", {
                success: true,
                message: savedMessage
            });

            console.log(`📌 채팅방 ${data.roomId}에 새 메시지 전송됨`);
        } catch (err) {
            console.error('메시지 전송 오류:', err);
            socket.emit("error", { message: "메시지 전송에 실패했습니다." });
        }
    });

    // 채팅방 목록 요청 처리
    socket.on("get_chat_rooms", async (data) => {
        try {
            const userEmail = data.userEmail;
            const rooms = await chatService.getUserChatRooms(userEmail);

            socket.emit("chat_rooms_list", rooms);
        } catch (err) {
            console.error('채팅방 목록 조회 오류:', err);
            socket.emit("error", { message: "채팅방 목록 조회에 실패했습니다." });
        }
    });

    // 메시지 읽음 표시 처리
    socket.on("mark_as_read", async (data) => {
        try {
            await chatService.markMessagesAsRead(data.roomId, data.userEmail);

            // 읽음 상태 변경을 다른 사용자에게 알림
            socket.to(data.roomId).emit("message_read", {
                roomId: data.roomId,
                reader: data.userEmail,
                timestamp: new Date()
            });
        } catch (err) {
            console.error('메시지 읽음 표시 오류:', err);
            socket.emit("error", {
                message: "메시지 읽음 표시 실패",
                details: err.message
            });
        }
    });

    // 채팅방 나가기 처리
    socket.on("leave_room", (roomId) => {
        socket.leave(roomId);
        console.log(`📌 사용자 ${socket.id}가 채팅방 ${roomId}에서 나갔습니다.`);
    });
};