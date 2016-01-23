function loginController($scope, $state, $http) {
	$scope.user = "";
	$scope.pass = "";

	$scope.login = function(){
		if ($scope.user != "" && $scope.pass != ""){
			$http({
				url: "/login",
				method: 'POST',
				data: {
					"username" : $scope.user,
					"password" : $scope.pass
				},
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data) {
				console.log("successful login");
			}).error(function(err) {
				console.log("falied login");
			});		
		}
	}
}