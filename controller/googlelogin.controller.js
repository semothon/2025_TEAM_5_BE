const axios = require('axios')
const googlelogin_services = require('../services/googlelogin.service');

exports.googlelogin = (req,res)=>{
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.SERVER_URL}/googlelogin/callback&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email&prompt=consent`;
    res.redirect(url)
}

exports.googlelogin_callback = async (req,res)=>{
    try {
        const token = await googlelogin_services.get_accesstoken(req);
        const email = await googlelogin_services.get_userinfo(token);
        await googlelogin_services.sendtoken(email,res);
        
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
}


