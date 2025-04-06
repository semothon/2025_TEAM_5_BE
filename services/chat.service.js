const mongoose = require('mongoose');
const Chat = require('../models/chat_model');

// 채팅방 찾기 또는 생성 서비스
exports.findOrCreateChatRoom = async (req) => {
  try {
    const { userEmail, friendEmail } = req.body;

    // 참가자 배열을 정렬해서 항상 일관된 roomId 생성
    const participants = [userEmail, friendEmail].sort();
    const roomId = `chat_${participants[0]}_${participants[1]}`;

    // 먼저 기존 채팅방이 있는지 확인
    let chatRoom = await Chat.findOne({ roomId });

    // 채팅방이 없으면 새로 생성
    if (!chatRoom) {
      chatRoom = await Chat.create({
        roomId,
        participants,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log(`새 채팅방 생성: ${roomId}`);
    } else {
      console.log(`기존 채팅방 찾음: ${roomId}`);
    }

    // 최근 메시지 50개만 클라이언트로 반환 (한 번만 정렬)
    const recentMessages = chatRoom.messages
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-50); // 마지막 50개만 가져오기

    // 반환할 데이터 구성
    const response = {
      roomId: chatRoom.roomId,
      participants: chatRoom.participants,
      messages: recentMessages,
      createdAt: chatRoom.createdAt
    };

    return response;
  } catch (err) {
    console.error('채팅방 찾기/생성 오류:', err);
    throw new Error(err.message);
  }
};

// 메시지 저장 서비스
exports.saveMessage = async (messageData) => {
  try {
    const { roomId, sender, content } = messageData;

    // 채팅방 찾기
    const chatRoom = await Chat.findOne({ roomId });

    if (!chatRoom) {
      throw new Error('존재하지 않는 채팅방입니다.');
    }

    // 새 메시지 객체 생성
    const newMessage = {
      sender,
      content,
      timestamp: new Date(),
      read: false
    };

    // 메시지 추가 및 updatedAt 갱신
    chatRoom.messages.push(newMessage);
    chatRoom.updatedAt = new Date();

    // 저장
    await chatRoom.save();

    return newMessage;
  } catch (err) {
    console.error('메시지 저장 오류:', err);
    throw new Error(err.message);
  }
};

// 사용자의 모든 채팅방 목록 조회
exports.getUserChatRooms = async (userEmail) => {
  try {
    // 사용자가 참여한 모든 채팅방 조회
    const chatRooms = await Chat.find({ participants: userEmail });

    // 각 채팅방의 마지막 메시지와 상대방 정보 추출
    const roomsWithDetails = chatRooms.map(room => {
      // 상대방 이메일 찾기
      const otherParticipant = room.participants.find(p => p !== userEmail);

      // 최근 메시지 찾기 (있는 경우)
      let lastMessage = null;
      if (room.messages.length > 0) {
        const sortedMessages = [...room.messages].sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        lastMessage = sortedMessages[0];
      }

      return {
        roomId: room.roomId,
        otherParticipant,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          sender: lastMessage.sender,
          timestamp: lastMessage.timestamp,
          read: lastMessage.read
        } : null,
        updatedAt: room.updatedAt
      };
    });

    // 마지막 메시지 시간 기준으로 정렬 (최신순)
    roomsWithDetails.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return roomsWithDetails;
  } catch (err) {
    console.error('채팅방 목록 조회 오류:', err);
    throw new Error(err.message);
  }
};

// 메시지 읽음 표시 서비스 추가
exports.markMessagesAsRead = async (roomId, userEmail) => {
  try {
    const chatRoom = await Chat.findOne({ roomId });
    if (!chatRoom) {
      throw new Error('존재하지 않는 채팅방입니다.');
    }

    let updated = false;
    // 상대방이 보낸 메시지만 읽음 표시
    chatRoom.messages.forEach(msg => {
      if (msg.sender !== userEmail && !msg.read) {
        msg.read = true;
        updated = true;
      }
    });

    if (updated) {
      await chatRoom.save();
    }

    return { success: true };
  } catch (err) {
    console.error('메시지 읽음 표시 오류:', err);
    throw new Error(err.message);
  }
};