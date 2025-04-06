const updateinfo_service = require('../services/updateinfo.service')

exports.updateinfo = async (req, res) => {
    try{
        console.log(`${req.user.email}님께서 updateinfo 요청`)
        await updateinfo_service.updateinfo(req,res);
    }
    catch(err){
        res.status(404).json(err)
    }
}