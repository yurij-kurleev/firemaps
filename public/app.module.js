'use strict';

const app = angular.module('app', ['ngRoute', 'ngCookies']);

// Routes
let routesConfig = ($routeProvider) => {
	$routeProvider.
		when('/home', {
			templateUrl: 'components/pages/home/home.html',
			controller: 'homeController'
		})
		.otherwise({
			redirectTo: '/home'
		});
};
routesConfig.$inject = ['$routeProvider', '$cookiesProvider'];

app.config(routesConfig);