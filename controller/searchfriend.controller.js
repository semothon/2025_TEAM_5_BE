const searchfriend_service = require('../services/searchfriend.service')

exports.searchfriend = async (req, res) => {
    try {
        console.log(`${req.user.email}님께서 searchfriend 요청`)
        const result = await searchfriend_service.searchFriends(req)
        res.status(200).json(result)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "친구 검색 실패", error: err.message })
    }
}