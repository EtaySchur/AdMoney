<?php

require_once 'server/db/manager.php';
require_once 'static/translations/heb.php';


if (($_POST) || (isset($_POST))) {

	$request = json_decode(file_get_contents("php://input"));

	switch ($request->action) {
		case 'getCompanies' :
			$companies = (DbManager::getAllCompanies());
			echo json_encode($companies);
			exit;

		case 'saveNewCompany' :
			$reulst = DbManager::insertToDb('companies', $request->data);
			//$result = DbManager::insertNewCompnay($request->data->title, $request->data->phone, $request->data->package);
			echo json_encode($result);
			exit;
		case 'suspendCompany' : $result = DbManager::suspendCompany($request->data->companyId);
			echo json_encode($result);
			exit;
		case 'getAdminUsers' : $result = DbManager::getAdminUsers();
			echo json_encode($result);
			exit;
		case 'verifyUser' :
			$result = DbManager::verifyUserLogin($request->data);
			echo json_encode($result);
			exit;
		case 'getCompanyUsers' : $result = DbManager::getCompanyUsers($request->data);
			echo json_encode($result);
			exit;
		case 'getCompanyCampaigns' :
			$result = DbManager::getCompanyCampaigns($request->data);
			echo json_encode($result);
			exit;
		case 'getCategories' :
			$result = DbManager::getCategories();
			echo json_encode($result);
			exit;
		case 'saveNewCategory' :
			$result = DbManager::insertToDb('categories', $request->data);
			echo json_encode($result);
			exit;
		case 'getUsers' :
			$result = DbManager::getFullUsersList();
			echo json_encode($result);
			exit;
		case 'getUserRealizations' :
			$result = DbManager::getUserRealizations($request->data);
			echo json_encode($result);
			exit;
		case 'getUserAds':
			$result = DbManager::getUserRealizations($request->data);
			echo json_encode($result);
			exit;
		case 'getCategoriesStatics':
			$result = DbManager::getCategoriesStatics();
			echo json_encode($result);
			exit;
		case 'getTranslations':
			$result = new HebrewTranslator();
			echo json_encode($result);
			exit;
		case 'saveNewCampaign':
			$result = DbManager::saveNewCampaign($request->data);
			echo json_encode($result);
			exit;
        case 'getCampaignTypes':
            $result = DbManager::getCampaignTypes();
            echo json_encode($result);
            exit;
        case 'saveNewResource':
            $result = DbManager::saveNewResource($request->data);
            echo json_encode($result);
            exit;

	}
}
?>
