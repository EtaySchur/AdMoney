<?php

require_once 'server/db/manager.php';


if (($_POST) || (isset($_POST))) {
	$user_id = json_decode(file_get_contents("php://input"));
	$result = DbManager::getUserDetails($user_id);
    var_dump($result);
			echo json_encode($result);
			exit;
	
}
?>
