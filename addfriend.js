const mongoose = require('mongoose');
const Friendlist = require('./models/friendlist_model');

// 김승님의 친구 목록 데이터 추가 함수
async function addKimseungFriendlist() {
    try {
        // 김승님의 이메일
        const kimseungEmail = 'personchicken0804@gmail.com';

        // 김승님의 친구 목록 데이터
        const friendlistData = {
            useremail: kimseungEmail,
            friends: [
                {
                    email: 'minjun@khu.ac.kr',
                    name: '김민준'
                },
                {
                    email: 'jihoon@khu.ac.kr',
                    name: '박지훈'
                },
                {
                    email: 'yeeun@khu.ac.kr',
                    name: '신예은'
                },
                {
                    email: 'gyuri@khu.ac.kr',
                    name: '도규리'
                },
                {
                    email: 'donggun@khu.ac.kr',
                    name: '여동건'
                }
            ]
        };

        // 이미 친구 목록이 있는지 확인
        let existingFriendlist = await Friendlist.findOne({ useremail: kimseungEmail });

        if (existingFriendlist) {
            // 이미 있으면 삭제하고 새로 생성
            await Friendlist.deleteOne({ useremail: kimseungEmail });
            console.log(`${kimseungEmail}의 기존 친구 목록이 삭제되었습니다.`);
        }

        // 새 친구 목록 생성
        const newFriendlist = new Friendlist(friendlistData);
        const savedFriendlist = await newFriendlist.save();

        console.log(`${kimseungEmail}의 친구 목록이 생성되었습니다:`, savedFriendlist);
        return savedFriendlist;
    } catch (error) {
        console.error('친구 목록 데이터 저장 중 오류 발생:', error);
        throw error;
    }
}


// 함수 내보내기
exports.addKimseungFriendlist = addKimseungFriendlist;