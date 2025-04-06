const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    participants: [{
        type: String,  // 사용자 이메일 또는 ID
        required: true
    }],
    messages: [{
        sender: {
            type: String,  // 발신자 이메일 또는 ID
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        read: {
            type: Boolean,
            default: false
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// 효율적인 조회를 위한 인덱스
ChatSchema.index({ 'participants': 1 });
ChatSchema.index({ 'messages.timestamp': -1 });

module.exports = mongoose.model('Chat', ChatSchema, 'chats');