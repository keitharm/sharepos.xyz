angular.module('sharepos.joinSession', [])

.controller('JoinSessionController', function($scope, $route, $location, $http, $cookies, Socket, uiGmapGoogleMapApi) {
    var code = $route.current.params.code;
    $http({
        method: "GET",
        url: "/validCode/" + code
    }).then(function(response) {
        if (response.data === "no bueno") {
            $location.path('/');
        };
    });

    $scope.$on("$destroy", function() {
        Socket.disconnect();
        clearInterval($scope.locLoop);
    });
    $scope.Math = window.Math;
    $scope.accuracy = 0;
    $scope.latitude = 0;
    $scope.longitude = -1;
    $scope.updateCount = 0;
    $scope.dataUsage = 0;

    $scope.updateRate = {
        value: 3,
        options: {
            onChange: function() {
                clearInterval($scope.locLoop);
                if ($scope.updateRate.value) {
                    startLocLoop();
                }
            },
            stepsArray: ["Off", 1, 2, 3, 4, 5, 10, 15, 30, 45, 60]
        }
    };

    code = $cookies.get('code');
    $scope.code = code;

    guid = $cookies.get('guid');
    $scope.guid = guid;

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
                guid: guid,
                code: code,
                locData: [data.coords.accuracy, data.coords.latitude, data.coords.longitude, new Date().getTime()]
            };
            $scope.data = [data.coords.accuracy, data.coords.latitude, data.coords.longitude, new Date().getTime()];
            $scope.accuracy = data.coords.accuracy;
            $scope.latitude = data.coords.latitude;
            $scope.longitude = data.coords.longitude;
            $scope.updateCount++;
            $scope.dataUsage += JSON.stringify(payload).length;
            $http.post('/updatePos', payload);
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
        $scope.locLoop = setInterval(function() {
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
