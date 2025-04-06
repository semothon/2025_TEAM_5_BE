const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    schoolid: {
        type: String,
    },
    major: {
        type: String,
    },
    mbti: {
        type: String,
    },
    discription: {
        type: String,
    },
    region: {
        type: String,
    },
    joinworldcup: {
        type: Boolean
    },
    profileImage: {
        type: String,
    },
    shortdiscription: {
        type: String
    }

})

module.exports = mongoose.model('User', UserSchema, 'user')