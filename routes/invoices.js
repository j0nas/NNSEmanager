var express = require('express');
var router = express.Router();

module.exports = function (invoiceHandler) {
    // FRONT-END VIEW RENDERING
    router.get('/new', function (req, res, next) {
        res.render('invoice/new')
    });
    router.get('/list', function (req, res, next) {
        res.render('invoice/list')
    });
    router.get('/edit/:id', function (req, res, next) {
        invoiceHandler.getInvoiceById(req.params.id, function (data) {
            res.render('invoice/edit', {
                invoice: data,
                id: req.params.id
            })
        })
    });

    // COLLECTION URI RESTful API
    router.get('/', function (req, res, next) {
        invoiceHandler.getAllInvoices(function (collection) {
                res.send(collection);
            }
        )
    });

    router.post('/', function (req, res) {
        invoiceHandler.saveInvoice(req.body, function (err) {
            if (err) {
                console.log('An error has occurred: ' + JSON.stringify(err));
                res.redirect(500, '/');
            } else {
                res.status(201).end();
            }
        });
    });

    // ELEMENT URI RESTful API
    router.post('/:id', function (req, res) {
        invoiceHandler.getInvoiceById(req.params.id, function (result) {
            res.send(result);
        });
    });
    router.put('/:id', function (req, res) {
        invoiceHandler.updateInvoiceById(req.params.id, req.body, function () {
            res.status(200).end();
        });
    });
    router.delete('/:id', function (req, res) {
        invoiceHandler.deleteInvoiceById(req.params.id, function (err) {
            res.send(err);
        });
    });

    return router;
}

