const mongoose = require('mongoose');
const Mailbox = require('./models/mailbox_model'); // 모델 경로를 적절히 수정하세요

// 이수현님에게 온 친구 요청 데이터 추가 함수
async function addFriendRequestsToSuhyun() {
    try {
        // 이수현님의 이메일
        const suhyunEmail = '2suhyni@khu.ac.kr';

        // 친구 요청 데이터 (sender만 다르고 receiver는 모두 이수현)
        const friendRequests = [
            {
                sender: {
                    name: '김민준',
                    email: 'minjun@khu.ac.kr'
                },
                receiver: {
                    name: '이수현',
                    email: '2suhyni@khu.ac.kr'
                }
            },
            {
                sender: {
                    name: '박지훈',
                    email: 'jihoon@khu.ac.kr'
                },
                receiver: {
                    name: '이수현',
                    email: '2suhyni@khu.ac.kr'
                }
            },
            {
                sender: {
                    name: '신예은',
                    email: 'yeeun@khu.ac.kr'
                },
                receiver: {
                    name: '이수현',
                    email: '2suhyni@khu.ac.kr'
                }
            },
            {
                sender: {
                    name: '도규리',
                    email: 'gyuri@khu.ac.kr'
                },
                receiver: {
                    name: '이수현',
                    email: '2suhyni@khu.ac.kr'
                }
            },
            {
                sender: {
                    name: '여동건',
                    email: 'donggun@khu.ac.kr'
                },
                receiver: {
                    name: '이수현',
                    email: '2suhyni@khu.ac.kr'
                }
            }
        ];

        // 1. 이수현님의 메일박스가 이미 있는지 확인
        let mailbox = await Mailbox.findOne({ email: suhyunEmail });

        if (mailbox) {
            // 2A. 메일박스가 있으면 친구 요청을, 기존 mails 배열에 추가
            const result = await Mailbox.findOneAndUpdate(
                { email: suhyunEmail },
                { $push: { mails: { $each: friendRequests } } },
                { new: true } // 업데이트된 문서 반환
            );

            console.log('이수현님의 메일박스에 친구 요청이 추가되었습니다:', result);
            return result;
        } else {
            // 2B. 메일박스가 없으면 새로 생성
            const newMailbox = new Mailbox({
                email: suhyunEmail,
                mails: friendRequests
            });

            const savedMailbox = await newMailbox.save();
            console.log('이수현님의 메일박스가 생성되었습니다:', savedMailbox);
            return savedMailbox;
        }
    } catch (error) {
        console.error('친구 요청 추가 중 오류 발생:', error);
        throw error;
    }
}

async function deleteAllMailbox() {
    try {
        await Mailbox.deleteMany({});
        console.log('모든 메일박스가 삭제되었습니다.');
    }
    catch (error) {
        console.error('모든 메일박스 삭제 중 오류 발생:', error);
        throw error;
    }
}

exports.addFriendRequestsToSuhyun = addFriendRequestsToSuhyun;
exports.deleteAllMailbox = deleteAllMailbox;

// 함수 실행
addFriendRequestsToSuhyun()
    .then(result => {
        console.log('작업 완료!');
    })
    .catch(err => {
        console.error('최종 오류:', err);
    });