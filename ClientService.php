<?php

require_once 'server/db/manager.php';


if (($_POST) || (isset($_POST))) {
    var_dump("Gettting Requ");
    var_dump($_POST);
	$request = json_decode(file_get_contents("php://input"));
    var_dump($request); exit;
	$result = DbManager::getUserDetails($user_id->data);
			echo json_encode($result);
			exit;
	
}
?>
