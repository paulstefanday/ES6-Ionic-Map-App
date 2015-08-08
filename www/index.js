angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller(...require('./js/components/map'))
.directive(...require('./js/directives/map'))
.directive(...require('./js/directives/test'))
;