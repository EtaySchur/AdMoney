<?php ?>



<!DOCTYPE html>
<html ng-app="managementApp" ng-controller="MainController">
	<head lang="en">
		<meta  http-equiv="content-type" content="text/html; charset=UTF-8">
		<title>Ad Money Management</title>
		<!-- Js -->
		<script src="static/js/d3.min.js"></script>
		<script src="static/js/jquery-1.11.1.min.js"></script>
		<script src="static/js/helpers.js"></script>
		<script src="static/js/angular/angular.min.js"> </script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/angular-strap/2.1.2/angular-strap.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/angular-strap/2.1.2/angular-strap.tpl.min.js"></script>
        <script src="//code.angularjs.org/1.3.1/angular-sanitize.min.js" data-semver="1.3.1"></script>
		<script src="static/js/angular/angular-file-upload-shim.js"></script>
		<script src="static/js/angular-spinner-master/spin.js"></script>
		<script src="static/js/angular-spinner-master/angular-spinner.js"></script>
		<script src="static/js/angular/angular-file-upload.js"></script>
		<script src="static/js/angular/ui-bootstrap-tpls-0.11.2.min.js"></script>
		<script src="static/js/angular/angular-route.min.js"></script>
		<script src="static/js/angular/moment.min.js"></script>
		<script src="static/js/daterangepicker.js"></script>
		<script src="static/js/angular/ng-bs-daterangepicker.js"></script>
		<script src="static/js/angular/angular-animate.min.js"></script>
		<script src="static/js/bootstrap/bootstrap.min.js"></script>
		<script src="static/js/angular/app.js"></script>
		<script src="static/js/angular/controllers.js"></script>
		<script src="static/js/angular/controllers/ContentController.js"></script>

		

		<!-- END of Js -->

		<!-- CSS -->
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="//mgcrea.github.io/angular-strap/styles/angular-motion.min.css">
        <link rel="stylesheet" href="//mgcrea.github.io/angular-strap/styles/bootstrap-additions.min.css">
        <link rel="stylesheet" href="//mgcrea.github.io/angular-strap/styles/libraries.min.css">
        <link rel="stylesheet" href="//mgcrea.github.io/angular-strap/styles/main.min.css">
		<link rel="stylesheet" href="static/css/bootstrap/bootstrap.css">
		<link rel="stylesheet" href="static/css/bootstrap/bootstrap-theme.css">
		<link rel="stylesheet" href="static/css/daterangepicker-bs3.css">
		<link rel="stylesheet" href="static/css/bootstrap/bootstrap.rtl.css">
		<link rel="stylesheet" href="static/css/system_admin_style.css">

		<!-- END CSS -->


	</head>
	<body>

		<nav ng-show="auth == true" class="navbar navbar-default" role="navigation">
			<div class="container-fluid">
				<!-- Brand and toggle get grouped for better mobile display -->
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="#">{{currentUser.title}}</a>
				</div>

				<!-- Collect the nav links, forms, and other content for toggling -->
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						<li ng-class="{active : isActive('campaigns')}"><a href="#/campaigns">קמפיינים</a></li>
						<li ng-class="{active : isActive('company_users')}"><a href="#/company_users">משתמשים</a></li>
						<!--li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">Actions <span class="caret"></span></a>
							<ul class="dropdown-menu" role="menu">
								<li><a href="#">Upload New Image</a></li>
								<li><a href="#">Another action</a></li>
								<li><a href="#">Something else here</a></li>
								<li class="divider"></li>
								<li><a href="#">Separated link</a></li>
								<li class="divider"></li>
								<li><a href="#">One more separated link</a></li>
							</ul>
						</li-->
					</ul>
					<form class="navbar-form navbar-left" role="search">
						<div class="form-group">
							<input type="text" ng-model="query" class="form-control" placeholder="חיפוש">
						</div>
						<button ng-click="refreshRotation()" type="button" class="btn btn-default">Refresh</button>
					</form>
                    <div class="calenders">

                        <div class="calender col-md-2">
                            <div>
                                <div class="row">
                                    <div class="col-md-12">

                                        <div class="input-group">
                                            <input  ranges="ranges"
                                                    ng-click="showDates()"
                                                    class="calender form-control"
                                                    type="daterange"
                                                    ng-model="dates1">
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
					<ul class="nav navbar-nav navbar-right col-md-3">
						<li> <a> שלום ,  {{currentUser.first_name}} </a></li>
					</ul>
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container-fluqid -->
		</nav>
		<div ng-hide="auth == true" class="login col-md-4 col-md-offset-4">
			<form name="userForm">

				<div class="form-group" ng-class="{ 'has-error': userForm.email.$invalid }" >
					<label>
						Email
					</label>
					<input ng-init="user.email = 'Jose@castro.com'" type="email" class="form-control" name="email" ng-model="user.email" required />
				</div>
				<div class="form-group">
					<label>
						Password
					</label>
					<input ng-init="user.password = 'fff'" value="fff" type="password" class="form-control" name="password" ng-model="user.password" required />
				</div>
				<button ng-click="verifyUser(user)" type="button" class="btn btn-default">Castro Login</button>
                <button ng-click="verifyUser('Renuar')" type="button" class="btn btn-default">Renuar Login</button>
                <button ng-click="verifyUser('SuperPharm')" type="button" class="btn btn-default">Super Pharm  Login</button>
                <button ng-click="verifyUser('Demo')" type="button" class="btn btn-default">Demo  Login</button>
			</form>
		</div>
        <span us-spinner="{radius:10, width:4, length: 16 , top : 45}" spinner-key="spinner-1"></span>
		<div class="main_app_view" ng-view ng-show="auth == true">

		</div>
		<div class="alert_section col-md-8 col-md-offset-2">
			<div id="info_alert" class="alert alert-dismissible" role="alert">
				<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
			</div>
		</div>
	</body>
</html>