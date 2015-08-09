const app = angular.module('map', ['ionic', 'ngCordova']);
require('./config')(app);

app
	.config(($stateProvider, $urlRouterProvider) => {

	    $urlRouterProvider.otherwise("/find");

	    $stateProvider
		  .state('find', {
	        url: "/find",
	        controller: require('./js/components/find.js'),
	        template: require('./js/components/find.jade')
	      })
	      .state('map', {
	        url: "/map",
	        controller: require('./js/components/map.js'),
	        template: require('./js/components/map.jade')
	      })
	      .state('report', {
	        url: "/report",
	        controller: require('./js/components/report.js'),
	        template: require('./js/components/report.jade')
	      })
	})

	.service(...require('./js/services/map'))
	.directive(...require('./js/directives/map'))
	;