mainController.$inject = ['$scope', '$state', '$http', '$rootScope'];
loginController.$inject = ['$scope', '$state', '$http', '$rootScope'];
dashboardController.$inject = ['$scope','$state', '$http', '$rootScope'];

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
			.state('dashboard.overview',{
				url: '/overview',
				templateUrl: 'views/dashboard/overview.html',
			})	
	}]);

	statly.directive('showAdd', function($parse) {
	    return function(scope, element, attrs) {
		    	scope.$watch(attrs.showAdd, function() {
			    	if ($parse(attrs.showAdd)(scope) == true) {
			    		element.css({
			    		    'visibility': 'visible',
			    		    'opacity': 1
			    		});
			    	} else {
			    		element.css({
			    		    'visibility': 'hidden',
			    		    'opacity': 0
			    		});
			    	}
		    	});
	    	}
	});