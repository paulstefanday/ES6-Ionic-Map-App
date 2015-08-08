const app = angular.module('map', ['ionic']);
require('./config')(app);

app
	.config(($stateProvider, $urlRouterProvider) => {

	    $urlRouterProvider.otherwise("/find/form");

	    $stateProvider
	      .state('find', {
	      	url: "/find",
	        abstract: true,
	        controller: require('./js/components/find.js'),
	        template: require('./js/components/find.jade')
	      })
		  .state('find.form', {
	        url: "/form",
	        controller: require('./js/components/find.form.js'),
	        template: require('./js/components/find.form.jade')
	      })
	      .state('find.map', {
	        url: "/map",
	        controller: require('./js/components/find.map.js'),
	        template: require('./js/components/find.map.jade')
	      })
	      .state('report', {
	        url: "/report",
	        controller: require('./js/components/report.js'),
	        template: require('./js/components/report.jade')
	      })
	})

	.directive(...require('./js/directives/map'))
	;