const getfriendlist_service = require('../services/getfriendlist.service')

exports.getfriendlist = async (req, res) => {
    try {
        console.log(`${req.user.email}님께서 getfriendlist 요청`)
        const result = await getfriendlist_service.getfriendlist(req);
        res.status(200).json(result)
    }
    catch (err) {
        res.send(err)
    }
}