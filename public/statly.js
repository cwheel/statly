mainController.$inject = ['$scope', '$state']
loginController.$inject = ['$scope', '$state', '$http']
dashboardController.$inject = ['$scope','$state']

var statly = angular.module('statly', ['ngAnimate','ui.router'])
	.controller('mainController',mainController)
	.controller('loginController',loginController)
	.controller('dashboardController',dashboardController)
	.config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('login', {
				url: '/',
				templateUrl : 'views/login.html',
				controller: 'loginController'
			})
			.state('dashboard',{
				url: '/dashboard',
				templateUrl: 'views/dashboard.html',
				controller: 'dashboardController'
			})		
	}]);
