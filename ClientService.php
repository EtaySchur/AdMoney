<?php

require_once 'server/db/manager.php';


if (($_POST) || (isset($_POST))) {
	$user_id = json_decode(file_get_contents("php://input"));
    var_dump($user_id); exit;
	$result = DbManager::getUserDetails($user_id->data);
			echo json_encode($result);
			exit;
	
}
?>
