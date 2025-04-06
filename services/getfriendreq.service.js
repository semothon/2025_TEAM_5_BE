const mongoose = require('mongoose')
const FriendRequest = require('../models/friendreq_model')

exports.getFriendRequests = async (req) => {
    try {
        const data = await FriendRequest.findOne({ recipientEmail: req.user.email });

        if (!data) {
            return [];
        }

        return data.requests;
    }
    catch (err) {
        throw new Error(err)
    }
}   