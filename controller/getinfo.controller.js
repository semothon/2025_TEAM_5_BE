const getinfo_service = require('../services/getinfo.service')

exports.getinfo = async (req, res) => {
    try{
        console.log(`${req.user.email}님께서 getinfo 요청`)
        const result = await getinfo_service.getinfo(req);
        res.status(200).json(result)
    }
    catch(err){
        res.send(err)
    }
}