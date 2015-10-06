var InvoiceModel = require("../models/InvoiceModel.js").Invoice;


module.exports = {
    saveInvoice: function (Invoice, next) {
        var InvoiceToSave = new InvoiceModel(Invoice);
        InvoiceToSave.save(function (err, res) {
            if (next) {
                next(err, res);
            }
        });
    },
    getInvoiceById: function (id, next) {
        InvoiceModel.findOne({'_id': id}, function (err, result) {
            next(result);
        });
    },
    getAllInvoices: function (next) {
        InvoiceModel.find(function (err, collection) {
            next(collection);
        });
    },
    updateInvoiceById: function (id, obj, next) {
        InvoiceModel.findOneAndUpdate({_id: id}, obj, {new: true}, function () {
            next();
        })
    },
    deleteInvoiceById: function (id, next) {
        InvoiceModel.findOneAndRemove({'_id': id}, function (err, result) {
            next(err);
        });
    },
    getLastInvoice: function (next) {
        InvoiceModel.find({}, function (err, res) {
            next(res[res.length - 1] ? res[res.length - 1].id_num : 0);
        });
    }
};
