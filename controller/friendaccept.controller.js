const friendaccept_service = require('../services/friendaccept.service')

exports.friendaccept = async (req, res) => {
    try {
        console.log(`${req.user.email}님께서 friendaccept 요청`)
        const result = await friendaccept_service.respondToFriendRequest(req)
        res.status(200).json(result)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "처리실패", error: err.message })
    }
}