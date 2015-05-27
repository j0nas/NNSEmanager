var mongoose = require('mongoose');

/*
 var addressSchema = mongoose.Schema({
 name: String,
 postcode: Number,
 region: String,
 municipality: String
 });*/

var tenantSchema = mongoose.Schema({
    ssn: String,
    first_name: String,
    last_name: String,
    //address: mongoose.Schema.Types.ObjectId, ref: 'address',
    phone: String,
    mail: String,
    mailbox: Number,
    lease: [{
        lessor: String,
        room: String,
        residency_start_date: Date,
        contract_termination_date: Date,
        residency_end_date: Date
    }]
});

var tenant = mongoose.model('tenant', tenantSchema);
//var address = mongoose.model('address', addressSchema);

module.exports = {
    Tenant: tenant
    //Address: address
}
