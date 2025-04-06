const mongoose = require('mongoose')
const User = require('../models/user_model')

exports.updateinfo = async (req,res) =>{
    const datas = req.body
    try{
        await User.updateOne(
            { email: req.user.email }, // 조건
            {
              $set: {
                name: datas.name,
                major: datas.major,
                schoolid: datas.schoolid,
                discription: datas.discription,
                region:datas.region,
                mbti:datas.mbti,
                joinworldcup:datas.joinworldcup,
                shortdiscription:datas.shortdiscription
              }
            }
          )
        res.status(200).json({message:"정보 변경 완료"})
    }
    catch(err){
        throw new Error(err)
    }
     
}