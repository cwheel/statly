function logController($scope, $state, $http, $rootScope) {
	$scope.level = ["Info","Warn","Error","Critical"];
	$scope.logs = $rootScope.instanceData.log;

	$scope.$on('dataAvalible', function() {
		$scope.level = ["Info","Warn","Error","Critical"];
		$scope.logs = $rootScope.instanceData.log;
	});
}