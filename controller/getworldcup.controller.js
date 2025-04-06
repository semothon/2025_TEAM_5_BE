const getworldcup_service = require('../services/getworldcup.service')

exports.getRandomWorldcupUsers = async (req, res) => {
    try {
        console.log(`${req.user.email}님께서 getRandomWorldcupUsers 요청`)
        const result = await getworldcup_service.getRandomWorldcupUsers(req);
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}