const addfriend_service = require('../services/addfriend.service')

exports.addfriend = async (req, res) => {
    try {
        console.log(`${req.user.email}님께서 addfriend 요청`)
        const result = await addfriend_service.addfriend(req)
        res.status(200).json(result)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "친구 추가 실패", error: err.message })
    }
}