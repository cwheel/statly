function dashboardController($scope, $state, $http) {
	$http({
		url: "/authed",
		method: 'GET'
	}).success(function(data) {
		if (!data == "true") {
			$state.go("login");
		}
	});

	$scope.apps = {"My First App" : ["Node 1", "Node 2", "Node 3"], "My Second App" : ["Node 1", "Node 2"]};
}