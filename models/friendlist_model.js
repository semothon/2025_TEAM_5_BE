const mongoose = require('mongoose')

const FriendlistSchema = new mongoose.Schema({
    useremail: {
        type: String,
        required: true,
    },
    friends: {
        type: [{
            email: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            profileImage: {
                type: String,
            }
        }],
        default: []
    },
})

module.exports = mongoose.model('Friendlist', FriendlistSchema, 'friendlist')