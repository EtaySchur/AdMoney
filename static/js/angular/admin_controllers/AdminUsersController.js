var adminUsersController = angular.module('adminUsersController' , []);

adminUsersController.controller('AdminUsersController', ['$rootScope' , '$scope' , '$http' , function($rootScope , $scope , $http){
	
		
	restCallManager.post(getAdminUsersCallback , $http , null , 'getAdminUsers' );
		
	function getAdminUsersCallback  (result , status , success){
		if(success){
			for(var i = 0 ; i < result.length ; i++){
				result[i].creation_date = new Date(result[i].creation_date).toDateString("yyyy-MM-dd");
			}
			$scope.adminUsers = result;
		}else{
			alertMe('danger' , "Get Admin Users Fail");
		}
	}
}]);

