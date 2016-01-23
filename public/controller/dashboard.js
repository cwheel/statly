function dashboardController($scope, $state, $http) {
	$http({
		url: "/authed",
		method: 'GET'
	}).success(function(data) {
		if (!data == "true") {
			$state.go("login");
		}
	});

	$scope.pane = "overview";

	$scope.apps = {"My First App" : ["Node 1", "Node 2", "Node 3"], "My Second App" : ["Node 1", "Node 2"]};

	$scope.application = Object.keys($scope.apps)[0];
	$scope.instance = $scope.apps[$scope.application][0];

	$state.go('dashboard.overview');

	$scope.itemSelected = function(app, instance) {
		$scope.application = app;
		$scope.instance = instance;
	};

	$scope.paneChanged = function() {
		console.log($scope.pane);
	};
}