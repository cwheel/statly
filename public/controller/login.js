function loginController($scope, $state, $http, $rootScope) {
	$scope.user = "";
	$scope.pass = "";

	$http({
		url: "/authed",
		method: 'GET'
	}).success(function(data) {
		if (data == "true") {
			$state.go("dashboard");
		}
	});

	$scope.login = function(){
		if ($scope.user != "" && $scope.pass != ""){
			$http({
				url: "/login",
				method: 'POST',
				data: $.param({username : $scope.user, password : $scope.pass}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data) {
				$rootScope.socket = io('http://localhost:3000');
				console.log({username: $scope.user, password: $scope.pass});
				$rootScope.socket.emit('initClient', {username: $scope.user, password: $scope.pass});

				$state.go("dashboard");
			}).error(function(err) {
				console.log("falied login");
			});		
		}
	}
}