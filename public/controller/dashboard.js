function dashboardController($scope, $state, $http, $rootScope) {
	$scope.colors = {};
	$http({
		url: "/authed",
		method: 'GET'
	}).success(function(data) {
		if (!data == "true") {
			$state.go("login");
		}
	});

	$scope.getColor = function(appName, item) {
		if ($scope.colors[appName] == undefined) {
			return "status-indicator-green";
		} else if ($scope.colors[appName][item] == undefined) {
			return "status-indicator-green";
		} else {
			return "status-indicator-" + $scope.colors[appName][item];
		}
	};

	$scope.setColor = function(appName, instance, color) {
		if ($scope.colors[appName] == undefined) $scope.colors[appName] = {}
		$scope.colors[appName][instance] = color;
	}

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
						
						try{
						$scope.instance = $scope.user.applications[0].instances[0].name;
						} catch (e) {}

						$rootScope.instance = $scope.instance;
						$rootScope.application = $scope.application;

						$rootScope.socket.emit('getInstance', $scope.instance);

						$rootScope.socket.on('recieveInstance', function(data) {
							if (data instanceof Array) {
								$rootScope.instanceData = data[0];
							} else {
								$rootScope.instanceData = data;
							}

							console.log($rootScope.instanceData);

							$scope.setColor($scope.application, $scope.instance, "green");
							$scope.$apply();

							$rootScope.$broadcast('dataAvalible');
						});

						$scope.$apply();
					});

					$rootScope.socket.on('appDisconnected', function(data) {
						$scope.setColor(data.appName, data.instance, "gray");
						$scope.$apply();
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

			$rootScope.socket.on('recieveInstance', function(data) {
				if (data instanceof Array) {
					$rootScope.instanceData = data[0];
				} else {
					$rootScope.instanceData = data;
				}

				console.log($rootScope.instanceData);

				$scope.setColor($scope.application, $scope.instance, "green");
				$scope.$apply();

				$rootScope.$broadcast('dataAvalible');
			});
			
			$scope.$apply();
		});

		$rootScope.socket.on('appDisconnected', function(data) {
			$scope.setColor(data.appName, data.instance, "gray");
			$scope.$apply();
		});
	}

	$scope.pane = "overview";
	$scope.showAddContainer = false;

	$state.go('dashboard.overview');

	$scope.itemSelected = function(app, instance) {
		$scope.application = app;
		$scope.instance = instance;

		$rootScope.instance = instance;
		$rootScope.application = app;

		$rootScope.socket.emit('getInstance', $scope.instance);
	};

	$scope.paneChanged = function() {
		$state.go('dashboard.' + $scope.pane);
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