var mailboxModel = require("../models/mailboxModel.js").Mailbox;

module.exports = {
    getMailboxById: function (id, next) {
        mailboxModel.findOne({'_id': id}, function (err, result) {
            next(result);
        });
    },

    getMailboxByNumber: function (number, next) {
        mailboxModel.findOne({'box_number': number}, function (err, result) {
            next(result);
        });
    },

    updateMailboxById: function (id, obj, next) {
        mailboxModel.findOneAndUpdate({_id: id}, obj, {new: true}, function () {
            next();
        })
    },

    unassignMailboxFromTenantById: function (id, next) {
        mailboxModel.findOneAndUpdate({tenant_id: id}, {tenant_id: ''}, {new: true}, function () {
            if (next) {
                next();
            }
        });
    },

    assignMailboxToTenant: function (tenant_id, box, next) {
        mailboxModel.findOneAndUpdate({box_number: box}, {tenant_id: tenant_id}, {new: true}, function () {
            if (next) {
                next();
            }
        });
    },

    getAllMailboxes: function (next) {
        mailboxModel.find(function (err, collection) {
            next(collection);
        });
    },

    getAllAvailableMailboxes: function (next) {
        mailboxModel.find({'tenantId': ""}, function (err, collection) {
            next(collection);
        });
    },

    deleteMailboxById: function (id, next) {
        mailboxModel.findOneAndRemove({'_id': id}, function (err, result) {
            next(err);
        });
    },

    saveMailbox: function (tenant, next) {
        var mailboxToSave = new mailboxModel(tenant);
        mailboxToSave.save(function (err, result) {
            console.log("mailboxHandler: " + err ? "err: " + err : result);
            next(err);
        });
    }
};
