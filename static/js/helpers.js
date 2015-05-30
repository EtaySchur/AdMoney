/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var ChartManager = function (){
	
};

var RestCallManager = function( callback , http) {
	
};

RestCallManager.prototype.post = function( callback , http , data , action ){
    console.log("post data");
    console.log(data);
	$('html').css('cursor' , 'progress');
	http.post('Controller.php', {
		"action" : action,
		"data" : data
	}).
	success(function(data, status) {
		callback(data , status , true);
		$('html').css('cursor' , 'default');
	})
	.
	error(function(data, status) {
		callback(data , status , false);
		$('html').css('cursor' , 'default');
	});
}


function alertMe ( type , text){
	var info_div =  $('#info_alert');
	$(info_div).addClass('alert-'+type);
	$(info_div).text(text);
	$('.alert_section').css('display' , 'block');
	$('.alert_section').fadeOut( 3000, function() {
		$('.alert_section').css('display' , 'none');
	});
}
		
		
ChartManager.prototype.createRealizationChart = function( type , chartName , data)	{
	
	
	var dataRowsArray = [];
	for(var i=0 ;i < data.length ; i++){
		var cArray = [];
		cArray[0] = {};
		cArray[1] = {};
		cArray[0]['v'] = data[i].title;
		cArray[1]['v'] = data[i].realizations.length;
		dataRowsArray[i] = {};
		dataRowsArray[i]['c'] = cArray;
	}
	
	var chart = {
		"type": type,
		"displayed": true,
		"data": {
			"cols": [

			{
				id: "t", 
				label: "Topping", 
				type: "string"
			},

			{
				id: "s", 
				label: "# Of Realizations", 
				type: "number"
			}
			], 
			"rows": dataRowsArray
		},
		"options": {
			"title": chartName,
			
			"isStacked": "true",
			"fill": 20,
			"displayExactValues": true,
			"vAxis": {
				"title": "Categories",
				"gridlines": {
					"count": 8
				}
			},
			"hAxis": {
				"title": "# Of Realizations"
			},
			"tooltip": {
				"isHtml": false
			}
		},
		"formatters": {}
	}
	return chart;
}


ChartManager.prototype.createSelectionChart = function( type , chartName , data)	{
	
	
	var dataRowsArray = [];
	for(var i=0 ;i < data.length ; i++){
		var cArray = [];
		cArray[0] = {};
		cArray[1] = {};
		cArray[0]['v'] = data[i].title;
		cArray[1]['v'] = data[i].selected_array.length;
		dataRowsArray[i] = {};
		dataRowsArray[i]['c'] = cArray;
	}
	
	var chart = {
		"type": type,
		"displayed": true,
		"data": {
			"cols": [

			{
				id: "a", 
				label: "Topping", 
				type: "string"
			},

			{
				id: "b", 
				label: "# Of Selections", 
				type: "number"
			}
			], 
			"rows": dataRowsArray
		},
		"options": {
			"title": chartName,
			"is3D": true,
			"isStacked": "true",
			"fill": 20,
			"displayExactValues": true,
			"vAxis": {
				"title": "Categories",
				"gridlines": {
					"count": 8
				}
			},
			"hAxis": {
				"title": "# Of Selections"
			},
			"tooltip": {
				"isHtml": false
			}
		},
		"formatters": {}
	}
	return chart;
}



