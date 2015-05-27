var mongoose = require('mongoose');

var mailboxSchema = mongoose.Schema({
    box_number: Number,
    tenant_id: String
});

var mailbox = mongoose.model('mailbox', mailboxSchema);
module.exports = {
    Mailbox: mailbox
}
