const mongoose = require('mongoose')

const FriendRequestSchema = new mongoose.Schema({
    // 요청을 받은 사용자의 이메일
    recipientEmail: {
        type: String,
        required: true,
        unique: true,
    },
    // 요청 목록 (요청을 보낸 사용자들의 정보)
    requests: {
        type: [{
            email: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        default: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('FriendRequest', FriendRequestSchema, 'friendrequests')