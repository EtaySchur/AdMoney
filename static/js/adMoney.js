/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


console.log('FUAD FUAD');
var myData = "10";
	
$.ajax({
		type: "POST",
		url: 'https://local.kampyle.com/code_tests/SystemAdmin/Client_Service.php',
		data: myData,
		action : "getUserAds",
		success: function(data){
           console.log(data);
          
        },
        error:function(){
            alert("failure");
        }
	});
