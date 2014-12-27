/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var categoriesController = angular.module('categoriesController' , ['angularCharts']);

categoriesController.controller('CategoriesController', ['$rootScope' , '$scope' , '$http' , function($rootScope , $scope , $http){
	restCallManager.post(getCategoriesCallback , $http, null , "getCategories");
	function getCategoriesCallback (categories , status , success){
		if(success){
			for(var i = 0 ; i < categories.length ; i++){
				categories[i].creation_date = new Date(categories[i].creation_date).toDateString("yyyy-MM-dd");
			}
			console.log(categories);
			$scope.categories = categories;
		}else{
	// TODO
	}
	}
	
	$scope.saveNewCategory = function (newCategory){
		restCallManager.post(saveNewCategoryCallback , $http, newCategory , "saveNewCategory");
		function saveNewCategoryCallback (result , status , success){
			if(success){
				newCategory.creation_date = result.creation_date;
				newCategory.id = result.id;
				$scope.categories.push(newCategory);
				alertMe('success', 'Save New Category Success');
			}else{
				alertMe('danger', 'Save New Category Fail');
			}
		}
	}
	
}]);


categoriesController.controller('CategoriesStaticsController', ['$rootScope' , '$scope' , '$http' , function($rootScope , $scope , $http){
    $scope.$emit('LOAD');	
	restCallManager.post(getCategoriesStaticsCallback , $http, null , "getCategoriesStatics");
	function getCategoriesStaticsCallback (result , status , success){
		if(success){
			
			
			$scope.chartType = 'pieChart';
			$scope.categories = result;
			$scope.$emit('UNLOAD');	
			$scope.pieChartRealization = chartManager.createRealizationChart('PieChart', 'Realizations Pie', $scope.categories);
			$scope.pieChartSelection = chartManager.createSelectionChart('PieChart', 'Selection Pie', $scope.categories);
		}else{
	
	}
	}
}]);