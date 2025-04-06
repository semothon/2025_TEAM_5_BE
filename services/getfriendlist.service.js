const mongoose = require('mongoose');
const Friendlist = require('../models/friendlist_model');

exports.getfriendlist = async (req, res) => {
    try {


        const datas = await Friendlist.find({ useremail: req.user.email });



        return datas

    }
    catch (err) {
        console.error('Error in getfriendlist:', err);
        return res.status(500).json({ message: '친구 목록을 가져오는 중 오류가 발생했습니다.' });
    }
}