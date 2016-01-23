function dashboardController($scope, $state, $http, $rootScope) {
	$http({
		url: "/authed",
		method: 'GET'
	}).success(function(data) {
		if (!data == "true") {
			$state.go("login");
		}
	});

	if ($rootScope.socket == undefined) {
		$http({
			url: "/socketKey",
			method: 'GET'
		}).success(function(data) {
			if (data == "invalid") {
				$state.go("login");
			} else {
				$rootScope.socket = io('http://localhost:3000');
				$rootScope.socket.emit('initClient', data);

				$rootScope.socket.emit('getUser');
				$rootScope.socket.on('recieveUser', function(user) {
					console.log(user);
				});
			}
		});
	} else {
		$rootScope.socket.emit('getUser');
		$rootScope.socket.on('recieveUser', function(user) {
			console.log(user);
		});
	}

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

		$http({
			url: "/newApplication",
			method: 'POST',
			data: $.param({name : $scope.newApp, key : $scope.newKey}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data) {
			console.log(data);
		}).error(function(err) {
			console.error("Failed to create new application");
		});	
	};
}