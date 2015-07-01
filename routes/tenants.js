var express = require('express');
var router = express.Router();

module.exports = function (tenantHandler, mailboxHandler, roomHandler) {
    // FRONT-END VIEW RENDERING
    router.get('/new', function (req, res, next) {
        res.render('tenant/new')
    });

    router.get('/list', function (req, res, next) {
        res.render('tenant/list', {url: 'active'})
    });
    router.get('/listall', function (req, res, next) {
        res.render('tenant/list', {url: 'all'})
    });

    router.get('/edit/:id', function (req, res, next) {
        tenantHandler.getTenantById(req.params.id, function (data) {
            res.render('tenant/edit', {
                tenant: data,
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

    // CSV file header
    var initHeader = 'Art.;Dato;Bilag;Mva;debetkonto;kreditkonto;beløp;\n';
    var csvString = initHeader;

    var initAddressHeader = 'kontonummer;Navn;adresse;postnummer;Poststed;telefonnummer;adresse2;\n'
    var csvAddressString = initAddressHeader;

    router.post('/invoices', function (req, res) {
        tenantHandler.getAllActiveTenants(function (tenants) {
            if (tenants.length < 1) {
                res.sendStatus(500);
                return;
            }

            // Get today's date as DD.MM.YY
            var date = new Date();
            var year = date.getFullYear() + '';
            var currentDate = date.getDate() + '.' + date.getMonth() + '.' + year.slice(2, 4);

            // Reset headers
            csvString = initHeader;
            csvAddressString = initAddressHeader;

            for (var i = 0; i < tenants.length; i++) {
                if (tenants[i].lease.length < 1 || !tenants[i].lease[tenants[i].lease.length - 1].room) {
                    var err = 'Fant ikke leie-data for leietaker ' + tenants[i].first_name + ' ' + tenants[i].last_name;
                    console.log(err);
                    res.send(err);
                }

                printRoom(tenants[i], i == (tenants.length - 1), currentDate, res);
            }
        });
    });
    function printRoom(tenant, lastTenant, date, res) {
        roomHandler.getRoomByNumber(tenant.lease[tenant.lease.length - 1].room, function (room) {
            if (!room || !room.price) {
                var err = 'Fant ikke rom-data for leietaker ' + tenant.first_name + ' ' + tenant.last_name;
                console.log(err);
                res.send(err);
                return;
            }

            csvString += '1;' + date + ';' + 'N/A;' + '9;' + 'N/A;' + ';' + room.price + ';\n';
            csvAddressString += 'N/A;' + tenant.first_name + ' ' + tenant.last_name + ';' + 'John Colletts Allé 110;' +
                '0870;' + 'Oslo;' + ';' + 'PB. ' + tenant.lease[tenant.lease.length - 1].mailbox + ';\n';

            if (lastTenant == true) {
                var fs = require('fs');
                fs.writeFile('./Invoices.csv', csvString, function () {
                    fs.writeFile('./Addresses.csv', csvAddressString, function () {
                        res.sendStatus(200);
                    });
                });
            }
        });
    }

    // COLLECTION URI RESTful API
    router.get('/', function (req, res, next) {
        tenantHandler.getAllTenants(function (collection) {
                res.send(collection);
            }
        )
    });
    router.post('/', function (req, res) {
        var mailboxNumber = req.body.mailbox;
        tenantHandler.saveTenant(req.body, function (err, tenant) {
            if (err) {
                console.log('An error has occurred: ' + JSON.stringify(err));
                res.redirect(500, '/');
            } else {
                mailboxHandler.assignMailboxToTenant(tenant._id, tenant.mailbox);
                roomHandler.assignRoomToTenant(tenant._id, tenant.room);
                res.send(tenant._id);
            }
        });
    });


    router.get('/all', function (req, res, next) {
        tenantHandler.getAllTenants(function (collection) {
                res.send(collection);
            }
        )
    });
    router.get('/active', function (req, res, next) {
        tenantHandler.getAllActiveTenants(function (collection) {
                res.send(collection);
            }
        )
    });

    // ELEMENT URI RESTful API
    router.post('/:id', function (req, res) {
        tenantHandler.getTenantById(req.params.id, function (result) {
            res.send(result);
        });
    });
    router.put('/:id', function (req, res) {
        tenantHandler.updateTenantById(req.params.id, req.body, function () {
            res.status(200).end();
        });

    });

    router.put('/lease/:id', function (req, res) {
        mailboxHandler.unassignMailboxFromTenantById(req.params.id);
        roomHandler.unassignRoomFromTenantById(req.params.id);

        mailboxHandler.assignMailboxToTenant(req.params.id, req.body.mailbox);
        roomHandler.assignRoomToTenant(req.params.id, req.body.room);

        tenantHandler.newTenantLease(req.params.id, req.body, function () {
            console.log('Updated tenant with new lease!');
            res.sendStatus(200);
        });
    });
    router.delete('/lease/:id', function (req, res) {
        mailboxHandler.unassignMailboxFromTenantById(req.params.id);
        roomHandler.unassignRoomFromTenantById(req.params.id);

        tenantHandler.deactivateLastTenantLease(req.params.id, function () {
            console.log('Deactivated tenants last lease!');
            res.sendStatus(200);
        });
    });


    router.delete('/:id', function (req, res) {
        mailboxHandler.unassignMailboxFromTenantById(req.params.id);
        roomHandler.unassignRoomFromTenantById(req.params.id);

        tenantHandler.deleteTenantById(req.params.id, function (err) {
            res.send(err);
        });
    });

    return router;
}

