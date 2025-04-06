const getmyinfo_service = require('../services/getmyinfo.service')

exports.getmyinfo = async (req, res) => {
    try{
        console.log(`${req.user.email}님께서 getmyinfo 요청`)
        const result = await getmyinfo_service.getmyinfo(req);
        console.log(result[0])
        res.status(200).json(result[0])
    }
    catch(err){
        res.send(err)
    }
}