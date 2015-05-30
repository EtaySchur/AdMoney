/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var usersController = angular.module('usersController' , []);

usersController.controller('UsersController', ['$rootScope' , '$scope' , '$http' , function($rootScope , $scope , $http){
	
	
	
	
	
	restCallManager.post(getUsersCallback , $http, null , "getUsers");
	function getUsersCallback (users , status , success){
		if(success){
			for(var i = 0 ; i < users.length ; i++){
				users[i].creation_date = new Date(users[i].creation_date).toDateString("yyyy-MM-dd");
			}
			$scope.users = users;
			console.log($scope.users);
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
