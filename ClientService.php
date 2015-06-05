<?php

require_once 'server/db/manager.php';


if (($_POST) || (isset($_POST))) {
	$request = json_decode(file_get_contents("php://input"));
	$result = DbManager::getUserDetails(10);
			echo json_encode($result);
			exit;
}
?>
