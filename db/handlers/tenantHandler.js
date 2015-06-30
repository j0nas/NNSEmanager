var tenantModel = require("../models/tenantModel.js").Tenant;

module.exports = {
    saveTenant: function (tenant, next) {
        var tenantToSave = new tenantModel(tenant);
        tenantToSave.active = false;
        tenantToSave.save(function (err, res) {
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
    getAllActiveTenants: function (next) {
        tenantModel.find({'active': true}, function (err, collection) {
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

    deactivateLastTenantLease: function (id, next) {
        tenantModel.findOne({_id: id}, function (err, res) {
            res.lease[res.lease.length - 1].active = false;
            res.active = false;

            tenantModel.findOneAndUpdate({_id: id}, res, {new: true}, function () {
                if (next) {
                    next();
                }
            });
        });
    },

    newTenantLease: function (id, obj, next) {
        tenantModel.findOne({'_id': id}, function (err, res) {
            res.lease.push({
                contract_start_date: obj.contract_start_date,
                contract_termination_date: obj.contract_termination_date,
                room: obj.room,
                mailbox: obj.mailbox,
                safety_deposit: obj.safety_deposit,
                active: obj.active
            });
            res.active = true;

            tenantModel.findOneAndUpdate({_id: id}, res, {new: true}, function () {
                if (next) {
                    next();
                }
            })
        })

    }
};
