angular.module('sharepos', [
  'sharepos.services',
  'sharepos.joinSession',
  'sharepos.index',
  'ngRoute',
  'ngCookies',
  'uiGmapgoogle-maps',
  'uiSwitch',
  'rzModule'
])
.config(function ($routeProvider, $httpProvider, uiGmapGoogleMapApiProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/index/index.html',
      controller: 'IndexController'
    })
    .when('/joinSession/:code', {
      templateUrl: 'app/joinSession/joinSession.html',
      controller: 'JoinSessionController'
    })
    .otherwise({
      redirectTo: '/'
    });

    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBa0w6wU9wbDvBFuNViFX3EPLCvCRrxtrA',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});
