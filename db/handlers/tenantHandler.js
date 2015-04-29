var tenantModel = require("../models/tenantModel.js").Tenant;

module.exports = {
    getTenantById: function (id, next) {
        tenantModel.findOne({'_id': id}, function (err, result) {
            next(result);
        });
    },

    getAllTenants: function (next) {
        tenantModel.find(function (err, collection) {
            next(collection);
        });
    },

    deleteTenantById: function (id, next) {
        tenantModel.findOneAndRemove({'_id': id}, function (err, result) {
            next(err);
        });
    },

    saveTenant: function (tenant, next) {
        var tenantToSave = new tenantModel(tenant);
        tenantToSave.save(function (err, result) {
            console.log("tenantHandler: " + result);
            console.log("err: " + err);
            next(err);
        });
    }
};
