angular.module('sharepos.index', [])

.controller('IndexController', function ($scope, $location, $http, $cookies) {
  navigator.geolocation.getCurrentPosition(function(blah) {} );
  var code = $cookies.get('code');
  if (code !== undefined) {
    $scope.code = code;
    $scope.previous = false;
  } else {
    $scope.previous = true;
  }

  $scope.startSession = function () {
    var guid = genGuid();
    var code = s4();

    $cookies.put('guid', guid);
    $cookies.put('code', code);

    $http.post('/newSession', {code: code}).then(function() {
      $location.path("/joinSession/" + code);
    });
  };

  $scope.enterCode = function (gameCode) {
    Socket.emit('joinGame', {gameCode:gameCode, playerOptions:{playerName:"bob"}});
    var newUrl = '/game/' + gameCode.toLowerCase();
    $location.path(newUrl);
  };

  // When a user enters the game code into the form field, they'll get forwarded to the ready screen
  // which allows them to opt in to a drawing.
  $scope.joinSession = function(code) {
    if (code !== undefined) {
      $location.path('/joinSession/' + code);
    } else {
      $location.path('/joinSession');
    }
  };

});

function genGuid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
