/**
 * Created by etayschur on 9/6/14.
 */

Parse.initialize("qGdQ2kRpIybF7t7TMaOphEqoZyyKgDUGM1nPqlPJ" , "BGUgvxJpnk15TxTk1kNVS65FQAYfrA7HZjKNmE8A");


var user = new Parse.User();
user.set("username", "Fuad");
user.set("password", "FuadFuad");
user.set("email", "etayschur@gmail.com");
Parse.User.signUp( null , {
    success : function (user) {
        alert("FUAD IN IN");
        console.log(user);
    },
    error: function (user , error) {
        console.log("ERROR "+error);
    }
});