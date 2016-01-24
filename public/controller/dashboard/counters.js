function countersController($scope, $state, $http, $rootScope) {
	$scope.counter = $rootScope.instanceData.counters;

	$scope.$on('dataAvalible', function() {
		$scope.counter = $rootScope.instanceData.counters;
	});

	if ($rootScope.instanceData != undefined) {
		$scope.counter = $rootScope.instanceData.counters;
	}
}