function usersController($scope, $state, $http, $rootScope) {
	$scope.users = [];
	$scope.selected = "";
	$scope.usertime = {};
	$scope.userhits = {};

	$scope.avgTime = 0;
	$scope.avgHits = 0;

	$scope.findUsers = function() {
		for (var i = 0; i < $rootScope.instanceData.timedRoutes.length; i++) {
			var name = $rootScope.instanceData.timedRoutes[i].user;

			if ($scope.usertime[name] == undefined) {
				$scope.usertime[name] = $rootScope.instanceData.timedRoutes[i].time;
			} else {
				$scope.usertime[name] += $rootScope.instanceData.timedRoutes[i].time
			}

			if ($scope.userhits[name] == undefined) {
				$scope.userhits[name] = 1;
			} else {
				$scope.userhits[name] += 1;
			}

			if ($scope.users.indexOf(name) == -1) {
				$scope.users.push(name);
			}

			$scope.avgHits += 1;
			$scope.avgTime += $rootScope.instanceData.timedRoutes[i].time;
		};

		$scope.avgHits = $scope.avgHits / Object.keys($scope.users).length;
		$scope.avgTime = $scope.avgTime / Object.keys($scope.users).length;

		try {
		$scope.selected = $scope.users[0];} catch (e) {}
	};

	$scope.viewUser = function(user) {
		$scope.selected = user;
	};

	$scope.$on('dataAvalible', function() {
		$scope.findUsers();
		$scope.$apply();
	});

	if ($rootScope.instanceData != undefined) {
		$scope.findUsers();
	}
}