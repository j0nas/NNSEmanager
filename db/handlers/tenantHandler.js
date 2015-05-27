var tenantModel = require("../models/tenantModel.js").Tenant;

module.exports = {
    saveTenant: function (tenant, next) {
        var tenantToSave = new tenantModel(tenant);
        tenantToSave.save(function (err, res) {
            console.log("tenantHandler: " + err ? "err: " + err : res);
            next(err, res);
        });
    },

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

    updateTenantById: function (id, obj, next) {
        tenantModel.findOneAndUpdate({_id: id}, obj, {new: true}, function () {
            next();
        })
    },

    deleteTenantById: function (id, next) {
        tenantModel.findOneAndRemove({'_id': id}, function (err, result) {
            next(err);
        });
    },
};
