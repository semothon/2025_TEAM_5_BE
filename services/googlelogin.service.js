const axios = require('axios')
const jwt = require('jsonwebtoken')
const User = require('../models/user_model')
const Mailbox = require('../models/mailbox_model')

exports.get_accesstoken = async (req) => {
    try {
        const code = req.query.code;
        console.log(code)
        const result = await axios.post("https://oauth2.googleapis.com/token", JSON.stringify({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code: code,
            redirect_uri: `${process.env.SERVER_URL}/googlelogin/callback`,
            grant_type: "authorization_code"
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return result.data.access_token
    }
    catch (err) {
        throw (err)
    }
}

exports.get_userinfo = async(token)=>{
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(`${userInfo.data.email}님 로그인`)
        return userInfo.data.email;
}

exports.sendtoken = async(email,res)=>{
    const ok = await User.find({ email: email })
        console.log(ok.length)
        if (ok.length === 0) {
            const newuser = new User({
                email: email,
                name:"",
                schoolid:"",
                major:"",
                mbti:"",
                region:"",
                discription:"",
                joinworldcup:true,
                profileImage:"https://firebasestorage.googleapis.com/v0/b/picknpick-3932d.firebasestorage.app/o/profileImages%2Fkimseung0630%40khu.ac.kr_a03ead04-add5-4df9-bfbb-dcf5623f438e?alt=media",
                shortdiscription:"",
            })
            try {
                await newuser.save();
                await Mailbox.create({ mails: [],email:email });
                console.log("✅ 저장 완료");
            }
            catch (saveErr) {
                console.error("❌ 저장 중 오류:", saveErr);
            }
        }

        const token = jwt.sign({ email: email }, "secret", { expiresIn: '1h' })
        console.log(token)

        res.redirect(`${process.env.FRONT_URL}?token=${token}&newmember=${ok.length}`);
}
