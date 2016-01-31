angular.module('sharepos.services', [])

.factory('Socket', function($rootScope) {
    var socket = io.connect("http://sharepos.xyz");

    var on = function(event, cb) {
        socket.on(event, function(data) {
            cb(data);
        });
    };

    var emit = function(event, data, cb) {
        socket.emit(event, data, function() {
            cb();
        });
    };

    var disconnect = function() {
        socket.emit("disconnect", true, function() {
        });
    };

    return {
        on: on,
        emit: emit,
        disconnect: disconnect
    };
});
