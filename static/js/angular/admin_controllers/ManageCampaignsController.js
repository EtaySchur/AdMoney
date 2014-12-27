/**
 * Created by etayschur on 10/25/14.
 */

var manageCampaignsController = angular.module('manageCampaignsController' , ['ngAnimate']);
manageCampaignsController.controller('ManageCampaignsController', ['$rootScope' , '$scope' , '$http' , function($rootScope , $scope , $http){
    restCallManager.post(getCampaignTypesCallback , $http, null , "getCampaignTypes");
    function getCampaignTypesCallback(result , status , success){
        if(success){
            $scope.campaign_types = result;
        }else{
            console.log("Error Getting Campaign Type "+status);
        }







    }



    $scope.clickMe = function(){
        alert('fufu');
    };

    $scope.consoleMe = function (){
        console.log('mouse enter');
    };


    $scope.initData = function(){
        console.log("INIT");
        console.log($scope.initial);
        angular.copy($scope.initial, $scope.campaign_types);
    };

    $scope.saveModel = function(){
        console.log("Saving Model");
        $scope.initial = angular.copy($scope.campaign_types);
        console.log($scope.initial);
    };

    $scope.fuad = function(){
        alert('fuad');
    }




}]);