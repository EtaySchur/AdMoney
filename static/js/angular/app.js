/**
 * Created by etayschur on 9/6/14.
 */

var systemAdminApp = angular.module('systemAdminApp' , [
    'ngAnimate',
	'ngBootstrap',
	'ui.bootstrap',
	'angularSpinner',
    'manageCampaignsController',
	'statisticsController',
	'googlechart',
	'usersController',
	'categoriesController',
	'angularFileUpload',
	'adminUsersController',
	'companiesController',
	'mainController',
	'ngRoute'
	]);

systemAdminApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/companies', {
		templateUrl:'partials/system_admin/companies_main.html',
		controller:'CompaniesController'
	}).
	when('/admin', {
		templateUrl:'partials/system_admin/admin_users_main.html',
		controller:'AdminUsersController'
	}).
	when('/categories', {
		templateUrl:'partials/system_admin/categories.html',
		controller:'CategoriesController'
	}).
	when('/categories_statics', {
		templateUrl:'partials/system_admin/categories_statics.html',
		controller:'CategoriesStaticsController'
	}).
	when('/users', {
		templateUrl:'partials/system_admin/users.html',
		controller:'UsersController'
	}).
	when('/category_statistics', {
		templateUrl:'partials/system_admin/statistics.html',
		controller:'StatisticsController'
	}).
        when('/manage_campaigns', {
            templateUrl:'partials/system_admin/manage_campaigns.html',
            controller:'ManageCampaignsController'
        }).
        otherwise({
            redirectTo:'/companies'
        });
}]);


var managementApp = angular.module('managementApp' , [
	'ngBootstrap',
	'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'mgcrea.ngStrap',
	'angularSpinner',
	'companyUsersController',
	'angularFileUpload',
	'mainController',
	'contentController',
	'ngRoute'
	]);

managementApp.config(function($popoverProvider) {
    angular.extend($popoverProvider.defaults, {
        html: true
    });
})


managementApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/company_users', {
		templateUrl:'partials/management/company_users_main.html',
		controller:'CompanyUsersController'
	}).
	when('/campaigns', {
		templateUrl:'partials/management/campaign.html',
		controller:'ContentController'
	}).
    when('/edit_campaign/campaign/:campaignId/package/:packageId', {
            templateUrl:'partials/management/campaign_detail.html',
            controller:'CampaignDetailsController'
    }).
	otherwise({
		redirectTo:'/campaigns'
	});
}]);

managementApp.directive('customPopover', function () {
    return {
        restrict: 'A',
        template: '<span>{{label}}</span>',
        link: function (scope, el, attrs) {
            scope.label = attrs.popoverLabel;
            $(el).popover({
                trigger: 'click',
                html: true,
                content: attrs.popoverHtml,
                placement: attrs.popoverPlacement
            });
        }
    };
});



systemAdminApp.filter('isStatus', function() {
	return function(input, status) {
		if(status == "ALL"){
			return input;
		}else{
			var out = [];
			for (var i = 0; i < input.length; i++){
		
				if(input[i].status == status)
					out.push(input[i]);
			}      
			return out;
		}

	};
});

systemAdminApp.filter('isGender', function() {
	return function(input, gender) {
		if(gender == "ALL"){
			return input;
		}else{
			var out = [];
			for (var i = 0; i < input.length; i++){
		
				if(input[i].gender == gender)
					out.push(input[i]);
			}      
			return out;
		}

	};
});


systemAdminApp.filter('isCategory', function() {
	return function(input, category) {
		if(category == "ALL"){
			return input;
		}else{
			var out = [];
			for (var i = 0; i < input.length; i++){
				for(var j = 0; j < input[i].categories.length ; j++){
					if(input[i].categories[j].title == category)
						out.push(input[i]);
				}
			}      
			return out;
		}

	};
});

systemAdminApp.filter('isPackage', function() {
	
	return function(input, packageType) {
		console.log("PACKAGE FILTER");
		console.log(input);
		if(packageType == "ALL"){
			return input;
		}else{
			var out = [];
			for (var i = 0; i < input.length; i++){
				
				if(input[i].package == packageType)
					out.push(input[i]);
				
			}      
			return out;
		}

	};
});

systemAdminApp.filter('dateRangeFilter', function() {
	return function(input, datesFilter) {
		console.log("DATE RANGING FILTER");
		if(input == undefined | datesFilter == "NONE"){
			return;
		}else{
			console.log("NIT UNDEFINED");
			var out = [];
			for (var i = 0; i < input.length; i++){
				var endDate = moment(new Date(datesFilter.endDate._d)).utc().format("YYYY-MM-DD HH:mm");
				var startDate = moment(new Date(datesFilter.startDate._d)).utc().format("YYYY-MM-DD HH:mm");
				var creationDate = moment(new Date(input[i].creation_date)).utc().format("YYYY-MM-DD HH:mm");
				if(startDate < creationDate && endDate > creationDate ){
					console.log("PAGA!!!!");
					out.push(input[i]);
				}
			}
			return out;
		}

	};
});

systemAdminApp.directive('shadow', function() {
    return {
        scope: {
            target: '=shadow'
        },
        link: function(scope, el, att) {
            scope[att.shadow] = angular.copy(scope.target);

            scope.commit = function() {
                scope.target = scope[att.shadow];
            };
        }
    };
});