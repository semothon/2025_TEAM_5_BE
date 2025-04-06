const getfriendreq_service = require('../services/getfriendreq.service')

exports.getfriendreq = async (req, res) => {
    try {
        console.log(`${req.user.email}님께서 getfriendreq 요청`)
        const result = await getfriendreq_service.getFriendRequests(req);
        res.status(200).json(result)
    }
    catch (err) {
        res.send(err)
    }
}