var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var db      = require('./models/db');

var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var routes  = require('./routes/index');
var session = require('express-session');
var io      = require('socket.io')(server);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'CHANGE THIS 1337!11!',
    resave: false,
    saveUninitialized: true
}));

app.use('/', routes);

server.listen(1337, function() {
    console.log("Listening on: " + 1337);
});

io.use(function(socket, next) {
    var data = socket.handshake || socket.request;
    socket.ip = socket.handshake.headers['x-real-ip'];
    console.log(socket.ip + " has connected!");
    next();
});

io.on('connection', function(socket) {

    //Update players location
    socket.on('locationUpdate', function(data) {
        console.log(data);
    });

    socket.on('disconnect', function() {
        console.log(socket.ip + " has disconnected");
    });
});

module.exports = app;
