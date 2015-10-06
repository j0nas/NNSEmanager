var mongoose = require('mongoose');

var invoiceSchema = mongoose.Schema({
    id_num: Number,
    tenant_id: String,
    amount: Number,
    date: Date,
});

var invoice = mongoose.model('invoice', invoiceSchema);

module.exports = {
    Invoice: invoice
}
