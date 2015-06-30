var mongoose = require('mongoose');

var tenantSchema = mongoose.Schema({
    ssn: String,
    first_name: String,
    last_name: String,
    phone: String,
    mail: String,
    active: Boolean,
    lease: [{
        contract_start_date: Date,
        contract_termination_date: Date,
        room: Number,
        mailbox: Number,
        safety_deposit: Number,
        active: Boolean
    }]
});

var tenant = mongoose.model('tenant', tenantSchema);

module.exports = {
    Tenant: tenant
}
