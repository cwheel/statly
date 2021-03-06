function overviewController($scope, $state, $http, $rootScope) {
	$scope.labels = ["1 Minute", "5 Minute", "15 Minute"];
	$scope.series = ['CPU Load'];
	$scope.data = [[0,0,0]];

	$scope.$on('dataAvalible', function() {
		try{
		$scope.data = [$rootScope.instanceData.sys.load];
		$scope.uptime =  Math.round(($rootScope.instanceData.sys.uptime/60/60/24) * 100) / 100;
		$scope.systype = $rootScope.instanceData.sys.type;
		$scope.bw = Math.round(($rootScope.instanceData.bandwith/1024/1024) * 100) / 100;

		$scope.mem = Math.round(($rootScope.instanceData.sys.memory.free / $rootScope.instanceData.sys.memory.total) * 100);
		$scope.$apply();
		} catch (e){}
	});

	if ($rootScope.instanceData != undefined) {
		try{
		$scope.data = [$rootScope.instanceData.sys.load];
		$scope.bw = Math.round(($rootScope.instanceData.bandwith/1024/1024) * 100) / 100;
		$scope.uptime =  Math.round(($rootScope.instanceData.sys.uptime/60/60/24) * 100) / 100;
		$scope.systype = $rootScope.instanceData.sys.type;

		$scope.mem = Math.round(($rootScope.instanceData.sys.memory.free / $rootScope.instanceData.sys.memory.total) * 100);
	} catch (e){}
}
}