const mongoose = require('mongoose');

const MailSchema = new mongoose.Schema({
  sender: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  receiver: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  }
}, { _id: false });

const MailboxSchema = new mongoose.Schema({
  mails: {
    type: [MailSchema],
    required: true,
    default: [],
  },
  email: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Mailbox', MailboxSchema, 'mailbox');