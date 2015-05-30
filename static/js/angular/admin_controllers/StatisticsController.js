var statisticsController = angular.module('statisticsController' , ['angularCharts']);

statisticsController.controller('StatisticsController', ['$rootScope' , '$scope' , '$http' , function($rootScope , $scope , $http){
	$scope.$emit('LOAD');	
	console.log("LOAD");
	restCallManager.post(getCategoriesStaticsCallback , $http, null , "getCategoriesStatics");
	function getCategoriesStaticsCallback (result , status , success){
		if(success){
			console.log(result);
			$scope.chartType = 'pieChart';
			$scope.categories = result;
		
			$scope.pieChartRealization = chartManager.createRealizationChart('PieChart', 'Realizations Pie', $scope.categories);
			$scope.pieChartSelection = chartManager.createSelectionChart('PieChart', 'Selection Pie', $scope.categories);
			
			$scope.colChartRealization = chartManager.createRealizationChart('ColumnChart', 'Realizations Column', $scope.categories);
			
     
    
			
			$scope.colChartSelection = chartManager.createSelectionChart('ColumnChart', 'Selection Column', $scope.categories);
			console.log('UNLOAD');
			$scope.$emit('UNLOAD');
		}else{
	
	}
	}
	
	$scope.chartisReady = function(){
		console.log('chart is ready!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	
}]);


