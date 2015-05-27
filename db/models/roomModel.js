var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
    number: Number,
    price: Number,
    tenant_id: String,
});

var room = mongoose.model('room', roomSchema);

module.exports = {
    Room: room
}
