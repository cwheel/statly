function executionController($scope, $state, $http, $rootScope) {
	$scope.selected = "";

	if($rootScope.instanceData != undefined) {
		var timedRoutes = $rootScope.instanceData.timedRoutes;
		$scope.routes = {};

		if (timedRoutes != undefined){
			for (var i = 0; i < timedRoutes.length; i++){
				if (timedRoutes[i].route in $scope.routes){
					$scope.routes[timedRoutes[i].route].count += 1;
					$scope.routes[timedRoutes[i].route].total += timedRoutes[i].time;
					if (timedRoutes[i].time > $scope.routes[timedRoutes[i].route].max){
						$scope.routes[timedRoutes[i].route].max = timedRoutes[i].time; 
					}
				} else {
					$scope.routes[timedRoutes[i].route] = {}
					$scope.routes[timedRoutes[i].route].count = 1;
					$scope.routes[timedRoutes[i].route].total = timedRoutes[i].time;
					$scope.routes[timedRoutes[i].route].max = timedRoutes[i].time;
				}
			}
		}

		try {
		$scope.selected = Object.keys($scope.routes)[0];} catch (e) {}
	}

	$scope.viewRoute = function(route) {
		$scope.selected = route;
	};

	$scope.$on('dataAvalible', function() {
		var timedRoutes = $rootScope.instanceData.timedRoutes;
		$scope.routes = {};

		if (timedRoutes != undefined){
			for (var i = 0; i < timedRoutes.length; i++){
				if (timedRoutes[i].route in $scope.routes){
					$scope.routes[timedRoutes[i].route].count += 1;
					$scope.routes[timedRoutes[i].route].total += timedRoutes[i].time;
					if (timedRoutes[i].time > $scope.routes[timedRoutes[i].route].max){
						$scope.routes[timedRoutes[i].route].max = timedRoutes[i].time; 
					}
				} else {
					$scope.routes[timedRoutes[i].route] = {}
					$scope.routes[timedRoutes[i].route].count = 1;
					$scope.routes[timedRoutes[i].route].total = timedRoutes[i].time;
					$scope.routes[timedRoutes[i].route].max = timedRoutes[i].time;
				}
			}
		}

		try {
		$scope.selected = Object.keys($scope.routes)[0];} catch (e) {}
	});
}