<?php ?>



<!DOCTYPE html>
<html ng-app="systemAdminApp" ng-controller="MainController">
	<head lang="en">
		<meta charset="UTF-8">
		<title> Ad Money System Admin</title>
		<!-- Js -->
		<script src="static/js/jquery-1.11.1.min.js"></script>
		<script src="static/js/helpers.js"></script>
		<script src="static/js/d3.min.js"></script>
		<script src="static/js/angular/angular.min.js"> </script>
		<script src="static/js/angular-spinner-master/spin.js"></script>
		<script src="static/js/angular-spinner-master/angular-spinner.js"></script>
		<script src="static/js/angular/ng-google-chart.js"> </script>
		<script src="static/js/angular/angular-file-upload-shim.js"></script>
		<script src="static/js/angular/angular-file-upload.js"></script>
		<script src="static/js/angular/angular-route.min.js"></script>
		<script src="static/js/angular/angular-animate.min.js"></script>
		<script src="static/js/angular/angular-charts.js"></script>
		<script src="static/js/bootstrap/bootstrap.min.js"></script>
		<script src="static/js/angular/moment.min.js"></script>
		<script src="static/js/daterangepicker.js"></script>
		<script src="static/js/angular/ng-bs-daterangepicker.js"></script>
		<script src="static/js/angular/ui-bootstrap-tpls-0.11.2.min.js"></script>
		<script src="static/js/angular/app.js"></script>
		<script src="static/js/angular/controllers.js"></script>
		<script src="static/js/angular/admin_controllers/CategoriesController.js"></script>
		<script src="static/js/angular/admin_controllers/UsersController.js"></script>
		<script src="static/js/angular/admin_controllers/StatisticsController.js"></script>
		<script src="static/js/angular/admin_controllers/CompaniesController.js"></script>
		<script src="static/js/angular/admin_controllers/AdminUsersController.js"></script>
        <script src="static/js/angular/admin_controllers/ManageCampaignsController.js"></script>


		<!-- END of Js -->

		<!-- CSS -->


		<link rel="stylesheet" href="static/css/daterangepicker-bs3.css">
		<link rel="stylesheet" href="static/css/bootstrap/bootstrap.rtl.css">
		<link rel="stylesheet" href="static/css/system_admin_style.css">

		<!-- END CSS -->


	</head>
	<body>

		<nav class="navbar navbar-default" role="navigation">
			<div class="container-fluid">
				<!-- Brand and toggle get grouped for better mobile display -->
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="#">AdMoney</a>
				</div>

				<!-- Collect the nav links, forms, and other content for toggling -->
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						<li ng-class="{active : isActive('users')}"><a href="#/users">{{translations.page_titles.users}}</a></li>
						<li ng-class="{active : isActive('companies')}"><a href="#/companies">{{translations.page_titles.companies}}</a></li>
						<li ng-class="{active : isActive('categories')}"><a href="#/categories">{{translations.page_titles.categories}}</a></li>
						<li ng-class="{active : isActive('statistics')}"><a href="#/category_statistics">{{translations.page_titles.statistics}}</a></li>
                        <li ng-class="{active : isActive('manage_campaigns')}"><a href="#/manage_campaigns">{{translations.page_titles.manage_campaigns}}</a></li>
						<li ng-class="{active : isActive('admin')}"><a href="#/admin_users">{{translations.page_titles.admin}}</a></li>
					</ul>
					<form class="navbar-form navbar-left" role="search">
						<div class="form-group">
							<input type="text" ng-model="query" class="form-control" placeholder={{translations.common.search}}>
						</div>

					</form>
					<div class="calenders">
						<div class="calender col-md-2">
							<div>
								<div class="row">
									<div class="col-md-12">
										<p class="input-group">
											<input type="text" class="form-control" datepicker-popup="{{format}}" ng-model="dt_start" is-open="opened_start" min-date="minDate" max-date="'2015-06-22'" datepicker-options="dateOptionsStart"  ng-required="true" close-text="Close" />
											<span class="input-group-btn">
												<button type="button" class="btn btn-default" ng-click="open_start($event)"><i class="glyphicon glyphicon-calendar"></i></button>
											</span>
										</p>
									</div>
								</div>
								<!--div class="row">
									<div class="col-md-6">
										<label>Format:</label> <select class="form-control" ng-model="format" ng-options="f for f in formats"><option></option></select>
									</div>
								</div-->


								<!--
								<button type="button" class="btn btn-sm btn-info" ng-click="today()">Today</button>
								<button type="button" class="btn btn-sm btn-default" ng-click="dt = '2009-08-24'">2009-08-24</button>
								<button type="button" class="btn btn-sm btn-danger" ng-click="clear()">Clear</button>
								<button type="button" class="btn btn-sm btn-default" ng-click="toggleMin()" tooltip="After today restriction">Min date</button>
								-->
							</div>
						</div>
						<div class="calender col-md-2">
							<div>
								<div class="row">
									<div class="col-md-12">

										<div class="input-group">
											<input  ranges="ranges" ng-click="showDates()" class="calender form-control" type="daterange" ng-model="dates1">
											<span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>
										</div>


									</div>
								</div>
								<!--div class="row">
									<div class="col-md-6">
										<label>Format:</label> <select class="form-control" ng-model="format" ng-options="f for f in formats"><option></option></select>
									</div>
								</div-->


								<!--
								<button type="button" class="btn btn-sm btn-info" ng-click="today()">Today</button>
								<button type="button" class="btn btn-sm btn-default" ng-click="dt = '2009-08-24'">2009-08-24</button>
								<button type="button" class="btn btn-sm btn-danger" ng-click="clear()">Clear</button>
								<button type="button" class="btn btn-sm btn-default" ng-click="toggleMin()" tooltip="After today restriction">Min date</button>
								-->
							</div>
						</div>
					</div>
					<!--span class="col-md-1" us-spinner="{radius:4, width:4, length: 16}" spinner-key="spinner-1"></span-->


					<!--ul class="nav navbar-nav navbar-right">
						<li><a href="#">Link</a></li>
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <span class="caret"></span></a>
							<ul class="dropdown-menu" role="menu">
								<li><a href="#">Action</a></li>
								<li><a href="#">Another action</a></li>
								<li><a href="#">Something else here</a></li>
								<li class="divider"></li>
								<li><a href="#">Separated link</a></li>
							</ul>
						</li>
					</ul-->
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container-fluid -->
		</nav>
		<span us-spinner="{radius:30, width:8, length: 16}" spinner-key="spinner-1"></span>
		<div class="main_app_view" ng-view>

		</div>
		<div class="alert_section col-md-8 col-md-offset-2">
			<div id="info_alert" class="alert alert-dismissible" role="alert">
				<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
			</div>
		</div>
	</body>
</html>