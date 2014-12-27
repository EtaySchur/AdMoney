var companiesController = angular.module('companiesController' , []);

companiesController.controller('CompaniesController', ['$rootScope' , '$scope' , '$http' , function($rootScope , $scope , $http){
	
	$scope.$emit('LOAD');	
	// Create the http post request
	// the data holds the keywords
	// The request is a JSON request.
		
	$http.post('Controller.php', {
		"action" : "getCompanies"
	}).
	success(function(data, status) {
		for(var i = 0 ; i < data.length ; i++){
			data[i].creation_date = new Date(data[i].creation_date).toDateString("yyyy-MM-dd");
		}
		
		$scope.companies = data;
		$scope.$emit('UNLOAD');	
		console.log($scope.companies);
	})
	.
	error(function(data, status) {
		console.log('error '+data);
		$scope.data = data || "Request failed";
		$scope.status = status;			
	});
		
	$scope.saveNewCompnay = function (newCompany){
		console.log(newCompany);
		restCallManager.post(insertNewCompanyCallback, $http, newCompany , "saveNewCompany");
		function insertNewCompanyCallback (result , status , success){
			if(success){
				alertMe('success' , "Save New Company Success");
				newCompany.id = result;
				$scope.companies.push(newCompany);
			}else{
				alertMe('danger' , "Save New Company Fail");
			}
		}
	}
	
	$scope.deleteCompany = function (companyId){
		restCallManager.post(deleteCompanyCallback, $http, companyId , "suspendCompany");
		
		function deleteCompanyCallback (result , status , success){
			if(success){
				alertMe('success' , "Delete Company Success");
			}else{
				alertMe('danger' , "Delete Company Fail");
			}
		}
	}
	
	
	
	
	
	
}]);