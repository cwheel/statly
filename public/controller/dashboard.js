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

				$rootScope.socket.on('initComplete', function () {
					$rootScope.socket.emit('getUser');
					$rootScope.socket.emit('registerObserverForUser');

					$rootScope.socket.on('recieveUser', function(user) {
						$scope.user = user;
						
						$scope.application = $scope.user.applications[0].name;
						$scope.instance = $scope.user.applications[0].instances[0].name;

						$rootScope.instance = $scope.instance;
						$rootScope.application = $scope.application;

						$rootScope.socket.emit('getInstance', $scope.instance);
						$rootScope.socket.emit('registerObserverForInstance', $scope.instance);

						$rootScope.socket.on('recieveInstance', function(data) {
							$rootScope.instanceData = data;
							console.log(data);
						});

						$scope.$apply();
					});

					$rootScope.socket.on('appDisconnected', function(data) {
						console.log(data);
					});
				});
			}
		});
	} else {
		$rootScope.socket.emit('getUser');
		$rootScope.socket.emit('registerObserverForUser');

		$rootScope.socket.on('recieveUser', function(user) {
			$scope.user = user;

			$scope.application = $scope.user.applications[0].name;
			$scope.instance = $scope.user.applications[0].instances[0].name;

			$rootScope.instance = $scope.instance;
			$rootScope.application = $scope.application;

			$rootScope.socket.emit('getInstance', $scope.instance);
			$rootScope.socket.emit('registerObserverForInstance', $scope.instance);

			$rootScope.socket.on('recieveInstance', function(data) {
				$rootScope.instanceData = data;
				console.log(data);
			});
			
			$scope.$apply();
		});

		$rootScope.socket.on('appDisconnected', function(data) {
			console.log(data);
		});
	}

	$scope.pane = "overview";
	$scope.showAddContainer = false;

	$state.go('dashboard.overview');

	$scope.itemSelected = function(app, instance) {
		$scope.application = app;
		$scope.instance = instance;

		$rootScope.instance = instance;
		$rootScope.application = application;

		$rootScope.socket.emit('registerObserverForInstance', $scope.instance);
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