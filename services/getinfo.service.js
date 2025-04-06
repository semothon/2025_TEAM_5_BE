const mongoose = require('mongoose')
const User = require('../models/user_model')



exports.getinfo = async (req) =>{
    try{
        const datas = await User.find({ email: req.body.email }) ;

        return datas
    }
    catch (err) {
        throw new Error(err)
    }
}