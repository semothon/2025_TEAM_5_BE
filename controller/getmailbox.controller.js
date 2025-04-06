const getmailbox_service = require('../services/getmailbox.service')

exports.getmailbox = async(req,res)=>{
    try{
        await getmailbox_service.getmailbox(req,res);
    }
    catch(err){
        res.status(404).json(err)
    }
}