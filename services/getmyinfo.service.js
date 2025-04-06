const mongoose = require('mongoose')
const User = require('../models/user_model')

exports.getmyinfo = async (req) =>{
    try{
        const datas = await User.find({ email: req.user.email }) ;
        return datas
    }
    catch (err) {
        throw new Error(err)
    }
}