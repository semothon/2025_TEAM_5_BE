const Chat = require('./models/chat_model'); // 모델 경로를 적절히 수정하세요

// 채팅방 데이터만 DB에 추가
async function addChatData() {
    // 사용자 정보
    const kimseungEmail = 'personchicken0804@gmail.com';
    const minjunEmail = 'minjun@khu.ac.kr';
    const yeeunEmail = 'yeeun@khu.ac.kr';

    // 채팅방 데이터
    const chatRoomsData = [
        // 첫 번째 채팅방: 김승과 김민준의 1:1 채팅
        {
            roomId: `chat_${[kimseungEmail, minjunEmail].sort()[0]}_${[kimseungEmail, minjunEmail].sort()[1]}`,
            participants: [kimseungEmail, minjunEmail].sort(),
            messages: [
                {
                    sender: kimseungEmail,
                    content: '안녕 민준아! 오늘 수업 들었어?',
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    read: true
                },
                {
                    sender: minjunEmail,
                    content: '응 들었어! 과제는 했어?',
                    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
                    read: true
                },
                {
                    sender: kimseungEmail,
                    content: '아직 시작 안 했어ㅠㅠ 같이 하면 좋을 것 같은데',
                    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
                    read: false
                }
            ],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 22 * 60 * 60 * 1000)
        },

        // 두 번째 채팅방: 김승과 신예은의 1:1 채팅
        {
            roomId: `chat_${[kimseungEmail, yeeunEmail].sort()[0]}_${[kimseungEmail, yeeunEmail].sort()[1]}`,
            participants: [kimseungEmail, yeeunEmail].sort(),
            messages: [
                {
                    sender: kimseungEmail,
                    content: '예은아 주말에 스터디 모임 할까?',
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    read: true
                },
                {
                    sender: yeeunEmail,
                    content: '좋아! 토요일 오후 어때?',
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
                    read: true
                },
                {
                    sender: kimseungEmail,
                    content: '토요일 2시에 도서관에서 보자',
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    read: false
                }
            ],
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
    ];

    try {
        // 데이터 저장
        for (const chatData of chatRoomsData) {
            // 기존 채팅방 삭제 후 새로 생성
            await Chat.deleteOne({ roomId: chatData.roomId });
            await Chat.create(chatData);
            console.log(`채팅방 생성됨: ${chatData.roomId}`);
        }
        console.log("채팅방 데이터 저장 완료");
    } catch (error) {
        console.error("에러:", error);
    }
}

exports.addChatData = addChatData;