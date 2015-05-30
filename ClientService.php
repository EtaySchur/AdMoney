<?php

require_once 'server/db/manager.php';


if (($_POST) || (isset($_POST))) {
	$user_id = json_decode(file_get_contents("php://input"));
    var_dump("Getting USers Details From Server");
	$result = DbManager::getUserDetails($user_id);
			echo json_encode($result);
			exit;
	
}
?>
