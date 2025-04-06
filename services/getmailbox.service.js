const Mailbox = require('../models/mailbox_model')

exports.getmailbox = async (req, res) => {
    try {
        const mailbox = await Mailbox.findOne({ email: req.user.email });
        res.status(200).json(mailbox)
    }
    catch (err) {
        throw new Error(err)
    }
}