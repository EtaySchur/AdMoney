/**
 * Created by etayschur on 9/6/14.
 */


var restCallManager = new RestCallManager();
var chartManager = new ChartManager();

var mainController = angular.module('mainController' , []);

mainController.controller('MainController', ['$rootScope' , '$scope' ,'$location' ,'$http' ,'$upload' , 'usSpinnerService' , function($rootScope , $scope , $location , $http , $upload , usSpinnerService){

	/* INIT FUNCTIONS */




	restCallManager.post(getTranslationsCallback, $http, "Heb" , "getTranslations");
	function getTranslationsCallback (result , status , success){
		$rootScope.translations = result.translator;
		console.log($rootScope.translations);
	}

    /*  Campaign Section */

        $rootScope.companyCampaigns = [];


    /* End Of Campaign Section */

    /*  Packages Section */
    $rootScope.packagesSizes = [];
    $rootScope.packagesSizes.default = [];
    $rootScope.packagesSizes.default[0] = { width : 9 , height : 5 , type : 'EXTRA_SMALL_IMAGE'};
    $rootScope.packagesSizes.default[1] = { width : 14 , height : 5 , type : 'SMALL_IMAGE'};
    $rootScope.packagesSizes.default[2] = { width : 32 , height : 6 , type : 'MEDIUM_IMAGE'};
    $rootScope.packagesSizes.default[3] = { width : 35 , height : 7 , type : 'LARGE_IMAGE'};
    $rootScope.packagesSizes.default[4] = { width : 12 , height : 5 , type : 'EXTRA_IMAGE'};
    /* End Of Packages Section */

	$rootScope.$on('LOAD' , function(){
		usSpinnerService.spin('spinner-1');
		$rootScope.loading = true;
	});
	
	$rootScope.$on('UNLOAD' , function(){
		usSpinnerService.stop('spinner-1');
		$rootScope.loading = false;
	});
	
	console.log("INIT");
	$rootScope.filters = [];
	$rootScope.filters.status = 'ALL';
	$rootScope.filters.gender = 'ALL';
	$rootScope.filters.category = 'ALL';
	$rootScope.filters.packageType = 'ALL';
	$rootScope.filters.sortType = 'creation_date';
	
	$scope.dates1 = {
		startDate: moment().subtract(365, 'day'),
		endDate: moment()
	};
	$scope.ranges = {
		'Today': [moment(), moment()],
		'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
		'Last 7 days': [moment().subtract('days', 7), moment()],
		'Last 30 days': [moment().subtract('days', 30), moment()],
		'This month': [moment().startOf('month'), moment().endOf('month')]
	};
	$rootScope.filters.datesFilter = $scope.dates1;
	
	console.log($rootScope.filters.endDate);

	/* ENND OF INIT FUNCTIONS */
	
	
	/* Calender */
	
	$scope.today = function() {
		console.log("To day");
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.clear = function () {
		$scope.dt = null;
	};

	// Disable weekend selection
	$scope.disabled = function(date, mode) {
		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	};

	$scope.toggleMin = function() {
		$scope.minDate = '2010-06-22';
	//$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.open_end = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened_end = true;
	};
	
	$scope.open_start = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened_start = true;
	};

	$scope.dateOptionsStart = {
		formatYear: 'yy',
		startingDay: 1
	};
	
	$scope.dateOptionsEnd = {
		formatYear: 'yy',
		startingDay: 1
	};
	
	$scope.periodCustom = function(dateStart, dateEnd) {
		alert('Date start: ' + dateStart + '\nDate end: ' + dateEnd);
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[3];
	
	/* END Calender */
	
	

	/* HELPERS FUNCTIONS */
	
	$scope.$watch('dates1' , function(){
		if($scope.dates1 != undefined){
			$rootScope.filters.datesFilter = $scope.dates1;
			
		}
	});

    $scope.refreshRotation = function() {
        restCallManager.post(refreshRotationCallback, $http, null, "refreshRotation");
        function refreshRotationCallback(result, status, success) {
                    console.log("Refreshed..");
        }
    }




	
	
	$rootScope.isActive = function (viewLocation) {
		var active = ($location.path().indexOf(viewLocation) > -1);
		return active;
	}
	
	$rootScope.setCurrentItem = function (itemIndex){
		console.log(itemIndex);
		$rootScope.currentIndex = itemIndex;
	}
	
	$rootScope.provisionTranslator = function (provisionInt){
		switch (provisionInt){
			case '4':
				return "OWNER";
			case '3' :
				return "ADMIN";
			case '2' :
				return "PUBLISHER";
		}
	}
	
	$rootScope.booleanTranslator = function (bol) {
	
		switch (bol){
			case '1':
				return "YES";
			case '0' :
				return "NO";
		}
	}
	
	$rootScope.onFileSelect = function ($files , fileName){
		var file = $files[0];
		if (file.type.indexOf('image') == -1) {
			$scope.error = 'image extension not allowed, please choose a JPEG or PNG file.'
			alertMe('danger' , $scope.error);
			return;
		}
		if (file.size > 2097152){
			$scope.error ='File size cannot exceed 2 MB';
			alertMe('danger' , $scope.error);
			return;
		} 
		$rootScope.upload = $upload.upload({
			url : 'UploadController.php',
			data : {
				fname : fileName , 
				company_name : "Castro"
			},
			file : file
		}).success(function(data, status, headers, config) {
			// file is uploaded successfully
			console.log(data);
		});
	};
	
	$rootScope.verifyUser = function (user){
        if(user === 'Renuar'){
            console.log("Renuar !!");
            var user = {};
            user.email = 'etayschur@gmail.com';
            user.password = 'Fuad';
        }
        if(user === 'SuperPharm'){

            var user = {};
            user.email = 'sophie@gmail.com';
            user.password = 'SOPHIE';
        }
        if(user === 'Demo'){

            var user = {};
            user.email = 'testDemo@gmail.com';
            user.password = 'DEMO';
        }

        console.log(user);

		restCallManager.post(verifyUserCallback, $http, user , "verifyUser");
		function verifyUserCallback (result , status , success){
			if(success){
				if(result == 'false'){
					alertMe('danger' , "Wrong User Name / Password");
				}else{
					console.log("USER DETAILS");
					console.log(result);
					alertMe('success' , "User Login Success");
					$rootScope.auth = true;
					$rootScope.currentUser = result;
					console.log($rootScope.currentUser);
				}
				
			}else{
				alertMe('danger' , "User Login Fail");
			}
		}
	}
/* END HELPERS FUNCTIONS */


	





}]);



