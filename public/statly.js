mainController.$inject = ['$scope', '$state', '$http', '$rootScope'];
loginController.$inject = ['$scope', '$state', '$http', '$rootScope'];
dashboardController.$inject = ['$scope','$state', '$http', '$rootScope'];
overviewController.$inject = ['$scope','$state', '$http', '$rootScope'];
usersController.$inject = ['$scope','$state', '$http', '$rootScope'];
countersController.$inject = ['$scope','$state', '$http', '$rootScope'];
executionController.$inject = ['$scope','$state', '$http', '$rootScope'];
logController.$inject = ['$scope','$state', '$http', '$rootScope'];

var statly = angular.module('statly', ['ngAnimate','ui.router', 'chart.js', 'anim-in-out'])
	.controller('mainController',mainController)
	.controller('loginController',loginController)
	.controller('dashboardController',dashboardController)
	.controller('usersController',usersController)
	.controller('overviewController',overviewController)
	.controller('countersController',countersController)
	.controller('executionController',executionController)
	.controller('logController',logController)
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
				controller: 'overviewController'
			})
			.state('dashboard.users',{
				url: '/users',
				templateUrl: 'views/dashboard/users.html',
				controller: 'usersController'
			})
			.state('dashboard.execution',{
				url: '/execution',
				templateUrl: 'views/dashboard/execution.html',
				controller: 'executionController'
			})
			.state('dashboard.counters',{
				url: '/counters',
				templateUrl: 'views/dashboard/counters.html',
				controller: 'countersController'
			})
			.state('dashboard.logs',{
				url: '/log',
				templateUrl: 'views/dashboard/log.html',
				controller: 'logController'
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