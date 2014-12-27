/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var contentController = angular.module('contentController' , []);

contentController.controller('ContentController', ['$rootScope' , '$scope' , '$http' , '$upload' , function($rootScope , $scope , $http , $upload){
	$scope.packageImagesSize = [];
    $scope.templateUrl = 'templates/bronze_package.html';
    $scope.packageImagesSize['Bronze'] = "<div>9X5</div> <div> 14X5 </div>";
    $scope.myPopover = { title : 'Sizes' , content:"avi nimni" };

    $scope.popovers = [];

    $scope.popover = {title: 'Title', content: 'Hello Popover<br />This is a multiline message!'};
	$rootScope.$watch('currentUser', function() {
		if($rootScope.currentUser != undefined){
                $scope.getCompanyCampaigns();

		}
		
	});

    $scope.getCompanyCampaigns = function(){
        $scope.newCampaign = [];
        /* Getting Company's Campaigns */
        restCallManager.post(getCompanyCampaignsCallback , $http, $rootScope.currentUser.company_id , "getCompanyCampaigns");
        function getCompanyCampaignsCallback (companyCampaigns , status , success){
            if(success){
                console.log(companyCampaigns);
                $scope.companyCampaigns = companyCampaigns;
                console.log($scope.companyCampaigns);
                $rootScope.companyCampaigns = companyCampaigns;

            }else{
                // TODO
            }
        }

        /* Getting All Packages */
        restCallManager.post(getCampaignTypesCallback , $http, null , "getCampaignTypes");
        function getCampaignTypesCallback(result , status , success) {
            if (success) {
                $scope.campaign_types = result;
                $scope.campaign_types.forEach(function (campaignType){
                    $scope.popovers[campaignType.title] = { title : 'Sizes' , content:campaignType.images_sizes};
                });
                console.log("POP OVERS");
                console.log($scope.popovers);
            } else {
                console.log("Error Getting Campaign Type " + status);
            }
        }
    };

    $scope.setCurrentTab = function(currentTab){
        console.log(currentTab);
        $scope.newCampaign.type_id = $scope.campaign_types[currentTab].id;
        $scope.tab = currentTab;
    }
	
	$scope.onCampaignHeaderImageSelect = function($files , fileName){
		console.log("FILE SELECT");
		var file = $files[0];
		console.log($files);
		if (file.type.indexOf('image') == -1) {
			console.log("FILE SELECT ERROR");
			$scope.headerImageErrorText = 'image extension not allowed, please choose a JPEG or PNG file.'
			$scope.headerImageError = true;
			alertMe('success' , $scope.error);
			return false;
		}
		if (file.size > 2097152){
			console.log("WONG SIZE");
			$scope.headerImageErrorText ='File size cannot exceed 2 MB';
			alertMe('success' , $scope.error);
			$scope.headerImageError = true;
			return false;
		}
		$scope.headerImageError = false;
		$scope.newCampaignHeaderImageFile = $files[0];
	}
	
	
	$scope.onCampaignMainImageSelect = function ($files , fileName){
		
		var file = $files[0];
		if (file.type.indexOf('image') == -1) {
			$scope.mainImageErrorText = 'image extension not allowed, please choose a JPEG or PNG file.'
			$scope.mainImageError = true;
			alertMe('success' , $scope.error);
			return false;
		}
		if (file.size > 2097152){
			$scope.mainImageErrorText ='File size cannot exceed 2 MB';
			alertMe('success' , $scope.error);
			$scope.mainImageError = true;
			return false;
		}
		$scope.mainImageError = false;
		$scope.newCampaignMainImageFile = $files[0];
		
		
	};
	
	$scope.saveNewCampaigns = function(newCampaign){
        var newDbCampaign = {};
        newDbCampaign.campaign_title = newCampaign.campaign_title;
        newDbCampaign.company_id = $rootScope.currentUser.company_id;
        newDbCampaign.packages = [];
        console.log($scope.campaign_types);
        $scope.campaign_types.forEach(function(campagin_type){
           if(campagin_type.spend_limit > 0 ){
               newDbCampaign.packages[campagin_type.id] = campagin_type;

           }
        });
        console.log(newDbCampaign);
        saveCamptainToDb(newDbCampaign);
        return;




        /*
		$scope.upload = $upload.upload({
			url : 'UploadController.php',
			data : {
				fname : $scope.newCampaignMainImageFile.name+'_Main' ,
				company_id : $rootScope.currentUser.company_id
			},
			file : $scope.newCampaignMainImageFile
		}).success(function(data, status, headers, config) {
			// file is uploaded successfully

            var dbCampaign = [];
            //dbCampaign.image_name = $scope.newCampaignMainImageFile.name;
            dbCampaign.company_id = $rootScope.currentUser.company_id;
            //dbCampaign.main_image = $scope.newCampaignMainImageFile;
                //newCampaignFinal.header_image = $scope.newCampaignHeaderImageFile;
                console.log(dbCampaign);
            saveCamptainToDb(dbCampaign);



		});
		*/
        function saveCamptainToDb(saveMe){
            restCallManager.post(saveNewCampaignCallback , $http, saveMe , "saveNewCampaign");
            function saveNewCampaignCallback(result , status , success){
                if(success){

                    $scope.getCompanyCampaigns();
                    alertMe('success' , 'New Campaign Saved Success');

                }
            }
        }



        /*
		$scope.upload = $upload.upload({
			url : 'UploadController.php',
			data : {
				fname : $scope.newCampaignHeaderImageFile.name+'_Header' ,
				company_name : "Castro"
			},
			file : $scope.newCampaignHeaderImageFile
		}).success(function(data, status, headers, config) {
			// file is uploaded successfully
			headerImageSucces = true;
			if(headerImageSucces && mainImageSuccess ){
				saveNewCampaignToDb(newCampaign);
		}

		});
		*/
		

	}
}]);

contentController.controller('CampaignDetailsController', ['$rootScope' , '$scope' , '$http' , '$routeParams' , '$upload', function($rootScope , $scope , $http , $routeParams , $upload){
    $scope.testPopover = { title:'Fuad Test Title' , placement:"top"}
console.log("Root Scope Campaings");
console.log($rootScope.companyCampaigns);

    $rootScope.$watch('currentUser', function() {

        if($rootScope.currentUser != undefined){
            $scope.getPackageResources();
        }

    });

    $scope.getPackageResources = function(init){
        $scope.$emit('LOAD');
        console.log("Getting Resources");
        var campaignId = $routeParams.campaignId;
        var packageId = $routeParams.packageId;
        if($rootScope.companyCampaigns.length == 0 || init == true){
            restCallManager.post(getCompanyCampaignsCallback , $http, $rootScope.currentUser.company_id , "getCompanyCampaigns");
            function getCompanyCampaignsCallback (companyCampaigns , status , success){
                if(success){
                    console.log(companyCampaigns);
                    $rootScope.companyCampaigns = companyCampaigns;
                    $rootScope.companyCampaigns.forEach(function (campaign){
                        if(campaign.id == campaignId){
                            console.log("NIDBAK");
                            $scope.selectedCampaign = campaign;
                            $scope.selectedCampaign.packages.forEach(function (campaignPackage){
                                if(campaignPackage.id == packageId){
                                    $scope.selectedPackage = campaignPackage;
                                }
                            });
                        }
                    });
                    console.log("SELECTED ITEMS");
                    console.log($scope.selectedPackage);
                    console.log($scope.selectedCampaign);

                }else{
                    // TODO
                }
                $scope.pageReady = true;
                $scope.$emit('UNLOAD');
            }
        }else{
            $rootScope.companyCampaigns.forEach(function (campaign){
                if(campaign.id == campaignId){
                    console.log("NIDBAK");
                    $scope.selectedCampaign = campaign;
                    $scope.selectedCampaign.packages.forEach(function (campaignPackage){
                        if(campaignPackage.id == packageId){
                            $scope.selectedPackage = campaignPackage;
                        }
                    });
                }
            });

            $scope.$emit('UNLOAD');
            $scope.pageReady = true;
        }
    };


    $scope.fakeInputClick = function(index){
        console.log("Clicking");
        $('#html_btn_'+index).click();

    }

    $scope.onCampaignMainImageSelect = function ($files , width , height , type){
        console.log($files[0]);
        console.log("ON IMAGE SELECT");
        var file = $files[0];
        console.log(file);
        if (file.type.indexOf('image') == -1) {
            $scope.mainImageErrorText = 'image extension not allowed, please choose a JPEG or PNG file.'
            $scope.mainImageError = true;
            alertMe('success' , $scope.error);
            return false;
        }
        if (file.size > 2097152){
            $scope.mainImageErrorText ='File size cannot exceed 2 MB';
            alertMe('success' , $scope.error);
            $scope.mainImageError = true;
            return false;
        }
        $scope.mainImageError = false;
        $scope.newCampaignMainImageFile = {};
        $scope.newCampaignMainImageFile.file  = $files[0];
        $scope.newCampaignMainImageFile.width = width;
        $scope.newCampaignMainImageFile.height = height;

        $scope.upload = $upload.upload({
            url : 'UploadController.php',
            data : {
                fname : $scope.newCampaignMainImageFile.file.name+'_'+$scope.newCampaignMainImageFile.width+'_'+$scope.newCampaignMainImageFile.height ,
                company_id : $rootScope.currentUser.company_id,
                campaign_id : $scope.selectedCampaign.id,
                package_id : $scope.selectedPackage.id,
                width : width,
                height : height,
                type : type
            },
            file : $scope.newCampaignMainImageFile.file
        }).success(function(data, status, headers, config) {
            // file is uploaded successfully

            var newResource = {};
            newResource.campaign_id = $scope.selectedCampaign.id;
            newResource.package_id = $scope.selectedPackage.id;
            newResource.width = width;
            newResource.height = height;
            newResource.title = $scope.newCampaignMainImageFile.file.name;
            newResource.company_id = $rootScope.currentUser.company_id;
            newResource.type = type;
            console.log('saveing new resource');
            console.log(newResource);
            restCallManager.post(saveNewResourceCallback , $http, newResource , "saveNewResource");
            function saveNewResourceCallback(result , status , success){
                $scope.getPackageResources(true);
                console.log(result);

            };
        });
    };
}]);


var companyUsersController = angular.module('companyUsersController' , []);



companyUsersController.controller('CompanyUsersController', ['$rootScope' , '$scope' , '$http' , function($rootScope , $scope , $http){
	
	$rootScope.$watch('currentUser', function() {
		if($rootScope.currentUser != undefined){
			restCallManager.post(getCompnayUsersCallback , $http , $rootScope.currentUser.company_id , 'getCompanyUsers' );
			function getCompnayUsersCallback  (result , status , success){
				if(success){
					console.log("Get companies Result");
					console.log(result);
					$scope.companyUsers = result;
				}else{
					alertMe('danger' , "Get Admin Users Fail");
				}
			}
		}
		
	});


	
	
}]);