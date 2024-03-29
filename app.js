var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('json spaces', 4);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

var tenantHandler = require(path.join(__dirname, "db/handlers/tenantHandler.js"));
var mailboxHandler = require(path.join(__dirname, "db/handlers/mailboxHandler.js"));
var roomHandler = require(path.join(__dirname, "db/handlers/roomHandler.js"));
var invoiceHandler = require(path.join(__dirname, "db/handlers/invoiceHandler.js"));

app.use('/tenants', require('./routes/tenants')(tenantHandler, mailboxHandler, roomHandler, invoiceHandler));
app.use('/mailboxes', require('./routes/mailboxes')(mailboxHandler));
app.use('/rooms', require('./routes/rooms')(roomHandler));
app.use('/invoices', require('./routes/invoices')(invoiceHandler));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/NNSEdb', function (error) {
    console.log(error ? error : 'Connected to NNSEdb - using mongoose as ORM');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
