var express = require('express');
var router = express.Router();

module.exports = function (tenantHandler) {
    // FRONT-END VIEW RENDERING
    router.get('/new', function (req, res, next) {
        res.render('tenant/new')
    });
    router.get('/list', function (req, res, next) {
        res.render('tenant/list')
    });


    // COLLECTION URI RESTful API
    router.get('/', function (req, res, next) {
        tenantHandler.getAllTenants(function (collection) {
                res.send(collection);
            }
        )
    });
    router.post('/', function (req, res, next) {
        tenantHandler.saveTenant(req.body, function (err) {
            if (err) {
                console.log('An error has occurred: ' + JSON.stringify(err));
                res.redirect(500, '/')
            } else {
                res.status(201).end();
            }
        });
    });

    // ELEMENT URI RESTful API
    router.post('/:id', function (req, res, next) {
        tenantHandler.getTenantById(req.params.id, function (result) {
            res.send(result);
        });
    });
    router.delete('/:id', function (req, res, next) {
        tenantHandler.deleteTenantById(req.params.id, function (err) {
            res.send(err);
        });
    });

    return router;
}

