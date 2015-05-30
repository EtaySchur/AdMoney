<?php

require_once 'server/db/manager.php';


if (($_POST) || (isset($_POST))) {
    var_dump("fuad");
	var_dump($_POST); exit;
	$user_id = json_decode(file_get_contents("php://input"));
	$result = DbManager::getUserDetails($user_id);
			echo json_encode($result);
			exit;
	
}
?>
