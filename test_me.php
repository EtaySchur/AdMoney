<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?>

<script src="static/js/angular/angular-file-upload-shim.min.js"></script> 
<script src="static/js/angular/angular.min.js"></script>
<script src="static/js/angular/angular-file-upload.min.js"></script> 
<script src="static/js/test.js"></script> 

<div ng-controller="MyCtrl">
  <input type="text" name="fname" ng-model="fname"/>
  <input type="file" ng-file-select="onFileSelect($files)" >
</div>