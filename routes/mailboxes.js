var express = require('express');
var router = express.Router();

module.exports = function (mailboxHandler) {
    // FRONT-END VIEW RENDERING
    router.get('/new', function (req, res, next) {
        res.render('mailbox/new')
    });
    router.get('/list', function (req, res, next) {
        res.render('mailbox/list')
    });
    router.get('/edit/:id', function (req, res, next) {
        mailboxHandler.getMailboxById(req.params.id, function (data) {
            res.render('mailbox/edit', {
                mailbox: data,
                id: req.params.id
            })
        })
    });

    router.post('/pdf', function (req, res) {
        if (!req.body.table) {
            res.sendStatus(400);
            return;
        }

        var fs = require('fs');
        var pdf = require('html-pdf');
        var html = '<table style="width: 100%;">' + req.body.table + '</table>';
        var options = {
            filename: './Tenants.pdf',
            format: 'Letter',
            border: '2.5cm'
        };

        pdf.create(html, options).toFile(function (error, result) {
            console.log(error ? error : result);
            res.sendStatus(error ? 500 : 200);
        });
    });

    // COLLECTION URI RESTful API
    router.get('/', function (req, res, next) {
        mailboxHandler.getAllMailboxes(function (collection) {
                res.send(collection);
            }
        )
    });

    router.post('/', function (req, res) {
        mailboxHandler.getMailboxByNumber(req.body.box_number, function (result) {
            if (result != null) {
                var errMsg = 'Postboks med dette nummeret eksisterer allerede.';
                console.log(errMsg);
                res.send({err: errMsg});
                return;
            }

            mailboxHandler.saveMailbox(req.body, function (err) {
                if (err) {
                    console.log('An error has occurred: ' + JSON.stringify(err));
                    res.redirect(500, '/');
                } else {
                    res.status(201).end();
                }
            });
        });
    });

    // ELEMENT URI RESTful API
    router.post('/:id', function (req, res) {
        mailboxHandler.getMailboxById(req.params.id, function (result) {
            res.send(result);
        });
    });
    router.put('/:id', function (req, res) {
        mailboxHandler.updateMailboxById(req.params.id, req.body, function () {
            res.status(200).end();
        });
    });
    router.delete('/:id', function (req, res) {
        mailboxHandler.deleteMailboxById(req.params.id, function (err) {
            res.send(err);
        });
    });

    return router;
}

