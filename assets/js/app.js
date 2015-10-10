angular.module('haxChatNoDb', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
    $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })
        .state('roomlist', {
            url: '/roomlist',
            templateUrl: 'templates/roomlist.html',
            controller: 'RoomlistCtrl'
        })
        .state('room', {
            url: '/room/:roomname',
            templateUrl: 'templates/room.html',
            controller: 'RoomCtrl'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl'
        })
    
    $urlRouterProvider.otherwise('/login');
})
