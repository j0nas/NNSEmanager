var mongoose = require('mongoose');

var tenantSchema = mongoose.Schema({
    ssn: String,
    first_name: String,
    last_name: String,
    phone: String,
    mail: String,
    mailbox: Number,
    room: Number,
    lease: [{
        //lessor: String,
        //room: Number,
        residency_start_date: Date,
        contract_termination_date: Date,
        //residency_end_date: Date
    }]
});

var tenant = mongoose.model('tenant', tenantSchema);

module.exports = {
    Tenant: tenant
}
