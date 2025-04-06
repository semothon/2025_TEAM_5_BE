const mongoose = require('mongoose');
const Mailbox = require('../models/mailbox_model');
const User = require('../models/user_model');

exports.addfriend = async (req) => {
    const { friendemail } = req.body;
    const currentUserEmail = req.user.email;

    try {
        // 자기 자신을 친구로 추가하는지 확인
        if (friendemail === currentUserEmail) {
            return { success: false, message: "자기자신" };
        }

        // 추가하려는 친구가 실제 존재하는 사용자인지 확인
        const friendUser = await User.findOne({ email: friendemail });
        if (!friendUser) {
            return { success: false, message: "존재하지않는사용자" };
        }

        // 이미 메일이 전송되었는지 확인
        const existingMail = await Mailbox.findOne({
            email: friendemail,
            "mails.sender.email": currentUserEmail
        });

        if (existingMail) {
            return { success: false, message: "이미요청됨" };
        }

        // 메일 데이터 준비
        const mailData = {
            sender: {
                name: req.user.name || req.user.username || "사용자",
                email: currentUserEmail
            },
            receiver: {
                name: friendUser.name || friendUser.username || "사용자",
                email: friendemail
            }
        };

        // 메일함 업데이트
        let mailbox = await Mailbox.findOne({ email: friendemail });

        if (mailbox) {
            // 메일함이 있는 경우, 새 메일 추가
            await Mailbox.updateOne(
                { email: friendemail },
                { $push: { mails: mailData } }
            );
        } else {
            // 메일함이 없는 경우, 새로운 문서 생성
            mailbox = new Mailbox({
                email: friendemail,
                mails: [mailData]
            });
            await mailbox.save();
        }

        return { success: true, message: "친구 요청 완료" };
    } catch (err) {
        return { success: false, message: `친구 요청 실패: ${err.message}` };
    }
};