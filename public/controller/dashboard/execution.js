function executionController($scope, $state, $http, $rootScope) {
	if($rootScope.instanceData != undefined){
		console.log("ITS HAPPENING");
		var timedRoutes = $rootScope.instanceData.timedRoutes;
		$scope.routes = {};
		if(timedRoutes != undefined){
			for (var i = 0;i < timedRoutes.length; i++){
				if(timedRoutes[i].route in $scope.routes){
					$scope.routes[timedRoutes[i].route].count += 1;
					$scope.routes[timedRoutes[i].route].total += timedRoutes[i].time;
					if (timedRoutes[i].time > $scope.routes[timedRoutes[i].route].max){
						$scope.routes[timedRoutes[i].route].max = timedRoutes[i].time; 
					}
				}else{
					$scope.routes[timedRoutes[i].route] = {}
					$scope.routes[timedRoutes[i].route].count = 1;
					$scope.routes[timedRoutes[i].route].total = timedRoutes[i].time;
					$scope.routes[timedRoutes[i].route].max = timedRoutes[i].time;
				}
			}
		}
	}
}