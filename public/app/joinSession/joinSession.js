angular.module('sharepos.joinSession', [])

.controller('JoinSessionController', function($scope, $route, $location, $cookies, $interval, Socket, uiGmapGoogleMapApi) {
    var code = $route.current.params.code;
    $scope.code = code;
    $scope.clients = [];
    $scope.guid = $cookies.get('guid');
    $scope.name = $scope.guid; // Default name to guid

    Socket.emit('joinRoom', {code: code, guid: $scope.guid});

    Socket.on('locationUpdate', function(data) {
        var newItems = [];

        for (item in data) {
          newItems.push({
            latitude: data[item].latitude,
            longitude: data[item].longitude,
            id: data[item].time
          })
        };

        $scope.clients = newItems;
        $scope.totalClients = Object.keys(data).length;
    });

    $scope.$on("$destroy", function() {
        Socket.disconnect();
        $interval.cancel($scope.locLoop);
    });

    $scope.updateGuid = function() {
        console.log($scope.guid);
    };
    
    $scope.Math = window.Math;
    $scope.accuracy = 0;
    $scope.latitude = 0;
    $scope.longitude = -1;
    $scope.updateCount = 0;
    $scope.dataUsage = 0;

    $scope.updateRate = {
        value: 1,
        options: {
            onChange: function() {
                $interval.cancel($scope.locLoop);
                if ($scope.updateRate.value) {
                    startLocLoop();
                }
            },
            stepsArray: ["Off", 1, 2, 3, 4, 5, 10, 15, 30, 45, 60]
        }
    };

    getLoc(function() {
        uiGmapGoogleMapApi.then(function(maps) {
            $scope.map = {
                center: {
                    latitude: $scope.data[1],
                    longitude: $scope.data[2]
                },
                zoom: 18,
                path: []
            };

            $scope.map.circle = {
                id: 1337,
                center: {
                    latitude: $scope.data[1],
                    longitude: $scope.data[2]
                },
                radius: $scope.data[0],
                stroke: {
                    color: '#08B21F',
                    weight: 2,
                    opacity: 0.5
                },
                fill: {
                    color: '#08B21F',
                    opacity: 0.25
                }
            };

            $scope.markers = {
                idKey: 1,
                coords: {
                    latitude: $scope.data[1],
                    longitude: $scope.data[2]
                }
            };

            startLocLoop();

        });

    });

    function getLoc(cb) {
        navigator.geolocation.getCurrentPosition(function(data) {
            var payload = {
                guid: $scope.guid,
                name: $scope.name,
                code: code,
                locData: [data.coords.accuracy, data.coords.latitude, data.coords.longitude, new Date().getTime(), $scope.name]
            };
            $scope.data = [data.coords.accuracy, data.coords.latitude, data.coords.longitude, new Date().getTime()];
            $scope.accuracy = data.coords.accuracy;
            $scope.latitude = data.coords.latitude;
            $scope.longitude = data.coords.longitude;
            $scope.updateCount++;
            $scope.dataUsage += JSON.stringify(payload).length;
            Socket.emit('locationUpdate', payload);
            cb();
        }, function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
        }, {
            enableHighAccuracy: $scope.highAccuracy,
            timeout: 10000,
            maximumAge: 0
        });
    }

    function startLocLoop() {
        $scope.locLoop = $interval(function() {
            getLoc(function() {
                $scope.markers = {
                    idKey: 1,
                    coords: {
                        latitude: $scope.data[1],
                        longitude: $scope.data[2]
                    }
                };

                //          $scope.map.path.push({latitude: $scope.data[1], longitude: $scope.data[2]});

                $scope.map.circle = {
                    id: 1337,
                    center: {
                        latitude: $scope.data[1],
                        longitude: $scope.data[2]
                    },
                    radius: $scope.data[0],
                    stroke: {
                        color: '#08B21F',
                        weight: 2,
                        opacity: 0.5
                    },
                    fill: {
                        color: '#08B21F',
                        opacity: 0.25
                    }
                };
                if ($scope.autoCenter) {
                    $scope.map.center = {
                        latitude: $scope.data[1],
                        longitude: $scope.data[2]
                    };
                }
            });

        }, $scope.updateRate.value * 1000);
    }
});
