const mongoose = require('mongoose')
const FriendRequest = require('../models/friendreq_model')
const Friendlist = require('../models/friendlist_model')
const User = require('../models/user_model')

exports.respondToFriendRequest = async (req) => {
    try {
        const { friendreqid, accept } = req.body
        const userEmail = req.user.email

        // 친구 요청 문서 찾기
        const friendRequestDoc = await FriendRequest.findOne({ recipientEmail: userEmail })

        if (!friendRequestDoc) {
            throw new Error('친구 요청을 찾을 수 없습니다.')
        }

        // 지정된 ID로 친구 요청 찾기
        const requestIndex = friendRequestDoc.requests.findIndex(
            request => request._id.toString() === friendreqid
        )

        if (requestIndex === -1) {
            throw new Error('해당 ID의 친구 요청을 찾을 수 없습니다.')
        }

        // 요청자 정보 저장
        const senderInfo = friendRequestDoc.requests[requestIndex]

        // 요청 수락인 경우 친구 목록에 추가
        if (accept === true) {
            // 현재 사용자 정보 가져오기
            const currentUser = await User.findOne({ email: userEmail })

            if (!currentUser) {
                throw new Error('사용자 정보를 찾을 수 없습니다.')
            }

            // 1. 내 친구 목록에 요청자 추가
            let myFriendlist = await Friendlist.findOne({ useremail: userEmail })

            if (!myFriendlist) {
                // 친구 목록이 없으면 새로 생성
                myFriendlist = new Friendlist({
                    useremail: userEmail,
                    friends: []
                })
            }

            // 친구 추가 (중복 체크 없이)
            myFriendlist.friends.push({
                email: senderInfo.email,
                name: senderInfo.name
            })
            await myFriendlist.save()

            // 2. 요청자의 친구 목록에 나를 추가
            let senderFriendlist = await Friendlist.findOne({ useremail: senderInfo.email })

            if (!senderFriendlist) {
                // 친구 목록이 없으면 새로 생성
                senderFriendlist = new Friendlist({
                    useremail: senderInfo.email,
                    friends: []
                })
            }

            // 친구 추가 (중복 체크 없이)
            senderFriendlist.friends.push({
                email: userEmail,
                name: currentUser.name
            })
            await senderFriendlist.save()
        }

        // 요청 목록에서 제거
        friendRequestDoc.requests.splice(requestIndex, 1)

        // 요청 목록이 비어있으면 문서 삭제, 아니면 업데이트
        if (friendRequestDoc.requests.length === 0) {
            await FriendRequest.findByIdAndDelete(friendRequestDoc._id)
        } else {
            await friendRequestDoc.save()
        }

        return {
            success: true,
            action: accept ? 'accepted' : 'rejected',
            friendEmail: senderInfo.email,
            friendName: senderInfo.name
        }
    } catch (err) {
        throw new Error(err)
    }
}