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
	$scope.showAddContainer = false;

	$scope.apps = {"Test Application" : ["Node 1", "Node 2", "Node 3"], "Another Application" : ["Node 1", "Node 2"]};

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

	$scope.addNewApp = function() {
	    var set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    $scope.newKey = "";

	    for (var i = 0; i < 30; i++) {
	        $scope.newKey += set.charAt(Math.floor(Math.random() * set.length));
	    }

		$scope.showAddContainer = true;
	};

	$scope.completeNewApp = function() {
		$scope.showAddContainer = false;
	};
}