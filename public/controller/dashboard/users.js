function usersController($scope, $state, $http, $rootScope) {
	$scope.users = [];

	$scope.findUsers = function() {

	};

	$scope.$on('dataAvalible', function() {
		$scope.findUsers();
		$scope.$apply();
	});

	if ($rootScope.instanceData != undefined) {
		$scope.findUsers();
	}
}