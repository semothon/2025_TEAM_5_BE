// 모델 import
const User = require('../../models/user_model');
const Mailbox = require('../../models/mailbox_model');
const Friendlist = require('../../models/friendlist_model');

module.exports = (socket, userSockets) => {
    // 기존 친구 요청 이벤트
    socket.on("wantfriend", async (data) => {

        console.log(data)
        const mailbox = await Mailbox.findOne({ email: data.receiveremail })
        console.log(mailbox)
        mailbox.mails.push({ sender: data.sender, receiver: data.receiver });
        console.log(mailbox)
        // await mailbox.save();
        const address = userSockets.get(data.receiveremail)
        const datas = await User.findOne({ email: data.senderemail })
        socket.to(address).emit("wantfriend", {
            sender: data.sender,
            receiver: data.receiver,
            schoolid: datas.schoolid,
            major: datas.major,
            mbti: datas.mbti,
            region: datas.region,
            discription: datas.discription,
            profileImage: datas.profileImage
        });

        // 예: 누군가와 매칭 시도 로직
        // userSockets 등을 사용해서 특정 사용자에게 메시지 보내는 것도 가능

        try {
            // 수신자의 메일함 찾기
            let mailbox = await Mailbox.findOne({ email: data.receiveremail });

            // 메일함이 존재하지 않으면 새로 생성
            if (!mailbox) {
                mailbox = new Mailbox({
                    email: data.receiveremail,
                    mails: []
                });
            }

            // 수정된 스키마에 맞게 메일함에 요청 추가
            mailbox.mails.push({
                sender: {
                    name: data.sender,
                    email: data.senderemail
                },
                receiver: {
                    name: data.receiver,
                    email: data.receiveremail
                }
            });
            await mailbox.save();

            // 수신자 소켓 주소 찾기
            const address = userSockets.get(data.receiveremail);
            // 보낸 사람 정보 가져오기
            const datas = await User.findOne({ email: data.senderemail });

            // 수신자에게 친구 요청 알림 전송
            if (address) {
                socket.to(address).emit("wantfriend", {
                    sender: data.sender,
                    receiver: data.receiver,
                    senderemail: data.senderemail,
                    receiveremail: data.receiveremail,
                    schoolid: datas.schoolid,
                    major: datas.major,
                    mbti: datas.mbti,
                    region: datas.region,
                    discription: datas.discription,
                    profileImage: datas.profileImage
                });
            }
        } catch (error) {
            console.error("친구 요청 전송 중 오류 발생:", error);
            socket.emit("error", { message: "친구 요청 전송에 실패했습니다" });
        }

    });

    // 친구 요청 수락 이벤트
    socket.on("acceptFriend", async (data) => {
        try {
            // 1. 메일함에서 요청 제거 (변경된 스키마에 맞게 수정)
            const receiverMailbox = await Mailbox.findOne({ email: data.receiveremail });

            // 새로운 스키마 구조에 맞게 필터 조건 수정
            receiverMailbox.mails = receiverMailbox.mails.filter(mail =>
                !(mail.sender.email === data.senderemail &&
                    mail.receiver.email === data.receiveremail)
            );
            await receiverMailbox.save();

            // 2. 양쪽 사용자의 친구 목록에 추가

            // 수신자(현재 사용자)의 친구 목록 업데이트
            let receiverFriendlist = await Friendlist.findOne({ useremail: data.receiveremail });
            if (!receiverFriendlist) {
                // 친구 목록이 없으면 새로 생성
                receiverFriendlist = new Friendlist({
                    useremail: data.receiveremail,
                    friends: []
                });
            }

            // 이미 친구인지 확인
            const isAlreadyFriend = receiverFriendlist.friends.some(friend => friend.email === data.senderemail);
            if (!isAlreadyFriend) {
                // 친구 목록에 추가
                receiverFriendlist.friends.push({
                    email: data.senderemail,
                    name: data.sender
                });
                await receiverFriendlist.save();
            }

            // 요청 보낸 사람의 친구 목록 업데이트
            let senderFriendlist = await Friendlist.findOne({ useremail: data.senderemail });
            if (!senderFriendlist) {
                // 친구 목록이 없으면 새로 생성
                senderFriendlist = new Friendlist({
                    useremail: data.senderemail,
                    friends: []
                });
            }

            // 이미 친구인지 확인
            const isSenderAlreadyFriend = senderFriendlist.friends.some(friend => friend.email === data.receiveremail);
            if (!isSenderAlreadyFriend) {
                // 친구 목록에 추가
                senderFriendlist.friends.push({
                    email: data.receiveremail,
                    name: data.receiver
                });
                await senderFriendlist.save();
            }

            // 3. 양쪽 사용자에게 새 친구 관계 알림
            // 현재 사용자(수신자)에게 알림
            const senderData = await User.findOne({ email: data.senderemail });
            socket.emit("friendRequestAccepted", {
                email: data.senderemail,
                name: data.sender,
                userData: senderData // 선택적으로 추가 정보 포함
            });

            // 보낸 사람에게 알림
            const senderAddress = userSockets.get(data.senderemail);
            if (senderAddress) {
                const receiverData = await User.findOne({ email: data.receiveremail });
                socket.to(senderAddress).emit("friendRequestAccepted", {
                    email: data.receiveremail,
                    name: data.receiver,
                    userData: receiverData // 선택적으로 추가 정보 포함
                });
            }
        } catch (error) {
            console.error("친구 요청 수락 중 오류 발생:", error);
            socket.emit("error", { message: "친구 요청 수락에 실패했습니다" });
        }
    });

    // 친구 요청 거절 이벤트
    socket.on("rejectFriend", async (data) => {
        try {
            // 메일함에서 요청 제거 (변경된 스키마에 맞게 수정)
            const mailbox = await Mailbox.findOne({ email: data.receiveremail });

            // 새로운 스키마 구조에 맞게 필터 조건 수정
            mailbox.mails = mailbox.mails.filter(mail =>
                !(mail.sender.email === data.senderemail &&
                    mail.receiver.email === data.receiveremail)
            );
            await mailbox.save();

            // 현재 사용자에게 요청이 제거되었음을 알림
            socket.emit("friendRequestRejected", {
                email: data.senderemail,
                name: data.sender
            });

            // 선택적으로 보낸 사람에게 거절 알림
            const senderAddress = userSockets.get(data.senderemail);
            if (senderAddress) {
                socket.to(senderAddress).emit("friendRequestRejected", {
                    email: data.receiveremail,
                    name: data.receiver
                });
            }
        } catch (error) {
            console.error("친구 요청 거절 중 오류 발생:", error);
            socket.emit("error", { message: "친구 요청 거절에 실패했습니다" });
        }
    });
};


//프론트 요청


// // For accepting friend request
// socket.emit("acceptFriend", {
//     receiveremail: yourEmail,
//     senderemail: requestSenderEmail,
//     sender: requestSender,
//     receiver: yourUsername
// });

// // For rejecting friend request
// socket.emit("rejectFriend", {
//     receiveremail: yourEmail,
//     senderemail: requestSenderEmail,
//     sender: requestSender,
//     receiver: yourUsername
// });

// // Listen for updates
// socket.on("friendRequestAccepted", (data) => {
//     // Add data.email to your friends list in UI
//     // Show notification
// });

// socket.on("friendRequestRejected", (data) => {
//     // Remove request from UI
// });