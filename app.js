var express = require('express');
var app     = express();
var server  = require('http').createServer(app);

var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

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

server.listen(1337, function() {
    console.log("Listening on: " + 1337);
});

io.use(function(socket, next) {
    var data = socket.handshake || socket.request;
    socket.ip = socket.handshake.headers['x-real-ip'];
    console.log(socket.ip + " has connected!");
    next();
});

locs = {};

io.on('connection', function(socket) {

    // Put user in room
    socket.on('joinRoom', function(data) {
        // Save the user's guid and code on the user's socket
        socket.guid = data.guid;
        socket.code = data.code;

        socket.join(data.code);  // Join the room with code
    });

    //Update players location
    socket.on('locationUpdate', function(data) {
        // Create/update user's location
        if (locs[data.code] === undefined) {
            locs[data.code] = {};
        }
        locs[data.code][data.guid] = data.locData;

        // Send socket all of the locations of users in this room
        socket.emit('locationUpdate', locs[data.code]);
    });

    socket.on('disconnect', function(data) {
        if (socket !== undefined && (socket.code in locs)) {
            delete locs[socket.code][socket.guid]; // Delete the user's location from the room
            socket.disconnect(true);
        }
    });
});

module.exports = app;
