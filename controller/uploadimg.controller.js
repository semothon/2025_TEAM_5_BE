const uploadimg_service = require('../services/uploadimg.service')

exports.uploadimg = async(req,res)=>{
    try{
        await uploadimg_service.uploadimg(req,res)
    }
    catch(err){
        res.status(404).json({message:"이미지 저장 실패"})
    }
}