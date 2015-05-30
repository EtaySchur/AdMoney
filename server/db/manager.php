<?php

class DbManager {

    const BRONZE_ID = 1;
    const SILVER_ID = 2;
    const GOLD_ID = 3;
    const VIDEO_ID = 4;

    const BRONZE = "BRONZE";
    const SILVER = "SILVER";
    const GOLD = "GOLD";
    const VIDEO = "VIDEO";


	protected $pdo;

	public function __construct() {
		
	}



	private static function connectToDb() {

    /* EC2 */

        $dbpass = 'Avishaynimni88';
        $dbhost = 'ec2-54-76-168-99.eu-west-1.compute.amazonaws.com';
        $dbname = 'MyBlog';
        $dbuser = 'etay';
        /* LOCAL */
		//$dbpass = 'Kulanu$namut09';
		//$dbhost = 'localhost';
		//$dbname = 'MyBlog';
		//$dbuser = 'root';
		$pdo = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass ,  array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
		return $pdo;
	}

	public static function insertNewUser($firstName, $lastName, $passWord) {
		$sql = "INSERT INTO users (first_name, last_name , password) VALUES (:name, :lname , :pw)";
		$q = $conn->prepare($sql);
		$q->execute(array(':name' => $firstName, ':lname' => $lastName, ':pw' => $passWord));
		return $conn->lastInsertId();
	}

	public static function insertNewCompnay($companyName, $phone, $package) {
		$sql = "INSERT INTO companies (title, package , phone) VALUES (:title, :package , :phone)";
		$conn = self::connectToDb();
		$q = $conn->prepare($sql);
		$q->execute(array(':title' => $companyName, ':phone' => $phone, ':package' => $package));
		return $conn->lastInsertId();
	}

	public static function getAllCompanies() {
		$result = array();
		$conn = self::connectToDb();
		$sql = "SELECT * from `companies`";
		$stmt = $conn->query($sql);
		$stmt->execute();
		$companies = $stmt->fetchAll(PDO::FETCH_ASSOC);
		foreach ($companies as $company) {
			$companyRealizations = self::getCompanyRealizations($company['id']);
			$companyUsers = self::getCompanyUsers($company['id']);
			$company['realizations'] = $companyRealizations;
			$company['users'] = $companyUsers;
			array_push($result, $company);
		}
		return $result;
		exit;
	}

	public static function getCategoriesStatics() {
		$result = array();
		$categories = self::getCategories();	
		foreach ($categories as $category){
			$realizations = self::getCategoryRealizations($category['id']);
			$selectedNumber = self::countSelectedCategory($category['id']);
			$category['realizations'] = $realizations;
			$category['selected_array'] = $selectedNumber;
			array_push($result,$category );
		}
		return $result;
	}

	public static function getCategoryRealizations($category_id) {
		$conn = self::connectToDb();
		$sql = $conn->prepare("SELECT * FROM realizations WHERE category_id=:categoryId");
		$sql->bindParam('categoryId', $category_id);
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}
	
	public static function countSelectedCategory($category_id){
		$conn = self::connectToDb();
		$sql = $conn->prepare("SELECT * FROM app_users2categories WHERE category_id=:categoryId");
		$sql->bindParam('categoryId', $category_id);
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

	public static function suspendCompany($company_id) {
		$conn = self::connectToDb();
		$sql = "UPDATE `companies` SET `active` = 0 WHERE id=$company_id";
		$stmt = $conn->query($sql);
		$stmt->execute();
		$result = $stmt->fetchAll();
		return $result;
		exit;
	}

    public static function refreshRotation(){
        self::deleteFromDb("campaign_rotation" , null , null);
    }

	public static function getCompanyCampaigns($company_id) {
		$conn = self::connectToDb();
		$sql = $conn->prepare("SELECT * from `campaigns` WHERE company_id = :company_id");
		$sql->bindParam('company_id', $company_id);
		$sql->execute();
		$campaigns = $sql->fetchAll(PDO::FETCH_ASSOC);
        foreach($campaigns as &$campaign){
            $sql = $conn->prepare("SELECT * from `campaign_packages`
                                   LEFT JOIN campaigns_type
                                   ON campaign_packages.type_id = campaigns_type.id
                                   WHERE campaign_id = :campaign_id");
            $sql->bindParam('campaign_id', $campaign['id']);
            $sql->execute();
            $campaign['packages'] = $sql->fetchAll(PDO::FETCH_ASSOC);
            foreach($campaign['packages'] as &$package){
                $sql = $conn->prepare("SELECT * from `resources`
                                      WHERE package_id = :package_id
                                      AND company_id =:companyId");
                $sql->bindParam('package_id', $package['id']);
                $sql->bindParam('companyId', $company_id);
                $sql->execute();
                $resources = $sql->fetchAll(PDO::FETCH_ASSOC);
                foreach($resources as $resource){
                    $package['resources'][$resource['type']] = $resource;
                }
            }


        }
		return $campaigns;
		exit;
	}

	public static function getAdminUsers() {
		$conn = self::connectToDb();
		$sql = "SELECT * from `users` WHERE `provision` = 5";
		$stmt = $conn->query($sql);
		$stmt->execute();
		$result = $stmt->fetchAll();
		return $result;
		exit;
	}

	public static function getCompanyUsers($company_id) {
		$conn = self::connectToDb();
		$sql = $conn->prepare("SELECT * from `users` WHERE company_id = :company_id");
		$sql->bindParam('company_id', $company_id);
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
		exit;
	}

	public static function verifyUserLogin($user) {
		$conn = self::connectToDb();
		$email = $user->email;
		$password = $user->password;


		$sql = $conn->prepare("SELECT * from `users` LEFT JOIN companies ON companies.id = users.company_id WHERE users.email = :userEmail AND users.password = :userPassword");
		$sql->bindParam('userEmail', $email);
		$sql->bindParam('userPassword', $password);
		$sql->execute();
		$result = $sql->fetch(PDO::FETCH_ASSOC);
		return $result;
		exit;
	}

    public static function getCompanyById($company_id){
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `companies` WHERE id=:companyId");
        $sql->bindParam('companyId', $company_id);
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
        exit;
    }

	public static function getCategories() {
		$conn = self::connectToDb();
		$sql = $conn->prepare("SELECT * from `categories`");
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
		exit;
	}

	public static function selectFromDb($tableName) {
		$conn = self::connectToDb();
		$sql = $conn->prepare("SELECT * from $tableName");
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
		exit;
	}

	public static function getUserRealizations($user_id) {
		$result = array();
		$conn = self::connectToDb();
		$sql = $conn->prepare("SELECT * from `realizations`  WHERE user_id = :userId");
		$sql->bindParam('userId', $user_id);
		$sql->execute();
		$realizations = $sql->fetchAll(PDO::FETCH_ASSOC);
		foreach ($realizations as $realization) {

			$sql = $conn->prepare("SELECT * from `coupons` WHERE id = :couponId");
			$sql->bindParam('couponId', $realization['coupon_id']);
			$sql->execute();
			$coupon = $sql->fetch(PDO::FETCH_ASSOC);
			$realization['coupon_details'] = $coupon;

			$sql = $conn->prepare("SELECT * from `companies` WHERE id = :companyId");
			$sql->bindParam('companyId', $coupon['company_id']);
			$sql->execute();
			$company_details = $sql->fetch(PDO::FETCH_ASSOC);
			$realization['company_details'] = $company_details;

			array_push($result, $realization);
		}
		return $result;
		exit;
	}



	public static function getUsersCategories($user_id) {
		$conn = self::connectToDb();
		$sql = $conn->prepare("SELECT a2c.* , categories.title , categories.id FROM `app_users2categories` AS a2c LEFT JOIN  categories ON categories.id = a2c.category_id WHERE app_user_id =:userId");
		$sql->bindParam('userId', $user_id);
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
		exit;
	}

	public static function getFullUsersList() {
		$result = array();
		$users = self::selectFromDb('app_users');
		foreach ($users as $user) {
			$userRealization = self::getUserRealizations($user['id']);
			$userCategories = self::getUsersCategories($user['id']);
			$user['realizations'] = $userRealization;
			$user['categories'] = $userCategories;
			array_push($result, $user);
		}
		return $result;
		exit;
	}

	public static function getCompanyRealizations($company_id) {
		$conn = self::connectToDb();
		$sql = $conn->prepare("SELECT * from coupons LEFT JOIN realizations ON coupons.id = realizations.coupon_id WHERE company_id =:companyId");
		$sql->bindParam('companyId', $company_id);
		$sql->execute();
		$result = $sql->fetchAll(PDO::FETCH_ASSOC);
		return $result;
	}

        public static function getCampaignTypes(){
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from campaigns_type");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public static function saveNewResource($newResource){
        $resource_id = self::insertToDb("resources", $newResource);
        return $resource_id;
    }

    public static function editResource($resources){
           $old_resource_id = $resources->oldResource->id;
           $result = self::deleteFromDb("resources" , "id" , $old_resource_id);
           self::saveNewResource($resources->newResource);
           // TODO - Check Validation
           return json_encode(array("success" => "success")); exit;

    }

    public static function deleteResourceFromDb($old_resource_id , $campaign_id , $package_id){

    }






	
	public static function saveNewCampaign($newCampaign){
		$campaignRow = array();
		$campaignRow['company_id'] = $newCampaign->company_id;
		$campaignRow['campaign_title'] = $newCampaign->campaign_title;
        //$campaignRow['image_name'] = $newCampaign->image_name;
        $campaignRow['campaign_id'] = self::insertToDb("campaigns", $campaignRow);
        $campaignRow['campaign_id'] = $campaignRow['campaign_id']['id'];
        if($campaignRow['campaign_id'] > 0 ){
            foreach($newCampaign->packages as &$package){
                if($package != null){
                    $newPackage = array();
                    $newPackage['spend_limit'] = $package->spend_limit;
                    $newPackage['type_id'] = $package->id;
                    $newPackage['campaign_id'] = $campaignRow['campaign_id'];
                    $result = self::insertToDb("campaign_packages", $newPackage);
                }

            }

            return $campaignRow;
        }else{
            return false;
        }
        exit;
       /*
		if($campaign_id > 0){
			$mainImage = array();
			$mainImage['title'] = $newCampaign->main_image->name;
			$mainImage['type'] = "IMAGE";
			$mainImage['resource_path'] = $newCampaign->main_image->name;
			$mainImageId = self::insertToDb("resources", $mainImage);
		
			if($mainImageId['id'] > 0 ){
				$r2cData = array('resource_id' => $mainImageId['id'] , 'campaign_id' => $campaign_id['id'] );
				self::insertToDb('resources2campaign', $r2cData);
			}else{
				return false;
			}
			
			$headerImage = array();
			$headerImage['title'] = $newCampaign->header_image->name;
			$headerImage['type'] = "IMAGE";
			$headerImage['resource_path'] = $newCampaign->header_image->name;
			$headerImageId = self::insertToDb("resources", $headerImage);
		
			if($headerImageId['id'] > 0 ){
				$r2cData = array('resource_id' => $headerImageId['id'] , 'campaign_id' => $campaign_id['id'] );
				self::insertToDb('resources2campaign', $r2cData);
				return true;
			}
			else{
				return false;
			}
			
			
		}else{
			return false;
		}
		*/
		
	}

    /* Extension Section */

    public static function getUserDetails($user_id) {
        $isBronzeFound = false;
        $isSilverFound = false;
        $isGoldFound = false;
        $isVideoFound = false;
        /* Getting User General Data */
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from app_users WHERE id =:userId");
        $sql->bindParam('userId', $user_id);
        $sql->execute();
        $user = $sql->fetch(PDO::FETCH_ASSOC);

        /* Getting User Categories */
        $sql = $conn->prepare("SELECT * from app_users2categories
                               LEFT JOIN categories
                               ON categories.id = app_users2categories.category_id
                               WHERE app_users2categories.app_user_id =:userId");
        $sql->bindParam('userId', $user_id);
        $sql->execute();
        $user['categories'] = $sql->fetchAll(PDO::FETCH_ASSOC);
        var_dump($user); exit;
        foreach($user['categories'] as &$category){
            $sql = $conn->prepare("SELECT * from companies
                                   LEFT JOIN campaigns
                                   ON campaigns.company_id = companies.id
                                   WHERE companies.category_id =:categoryId");
            $sql->bindParam('categoryId', $category['id']);
            $sql->execute();
            $category['campaigns'] = $sql->fetchAll(PDO::FETCH_ASSOC);
            $campaign['resources'] = array();
            foreach($category['campaigns'] as &$campaign){
                $sql = $conn->prepare("SELECT * from campaign_packages
                                   LEFT JOIN campaigns_type
                                   ON campaign_packages.type_id = campaigns_type.id
                                   WHERE campaign_packages.campaign_id =:campaignId");
                $sql->bindParam('campaignId', $campaign['id']);
                $sql->execute();
                $campaign['info']  = $sql->fetchAll(PDO::FETCH_ASSOC);

                $sql = $conn->prepare("SELECT * from resources
                                       WHERE campaign_id =:campaignId
                                       AND
                                       package_id =:packageId
                                       AND  NOT EXISTS
                                        (
                                            SELECT  *
                                            FROM    campaign_rotation
                                            WHERE   campaign_rotation.user_id =:userId
                                            AND     campaign_rotation.package_id =:packageId
                                            AND     campaign_rotation.campaign_id =:campaignId
                                        )
                                       ");
                $packageId = self::BRONZE_ID;
                $sql->bindParam('packageId', $packageId);
                $sql->bindParam('campaignId', $campaign['id']);
                $sql->bindParam('userId', $user_id);
                $sql->execute();
                $result = $sql->fetchAll(PDO::FETCH_ASSOC);
                if(count($result) > 0){
                    $isBronzeFound = true;
                    $campaign['resources'][self::BRONZE] = $result;
                }


                $sql = $conn->prepare("SELECT * from resources
                                       WHERE campaign_id =:campaignId
                                       AND
                                       package_id =:packageId
                                       AND  NOT EXISTS
                                        (
                                            SELECT  *
                                            FROM    campaign_rotation
                                            WHERE   campaign_rotation.user_id =:userId
                                            AND     campaign_rotation.package_id =:packageId
                                            AND     campaign_rotation.campaign_id =:campaignId
                                        )
                                       ");
                $packageId = self::SILVER_ID;
                $sql->bindParam('packageId', $packageId);
                $sql->bindParam('campaignId', $campaign['id']);
                $sql->bindParam('userId', $user_id);
                $sql->execute();
                $result = $sql->fetchAll(PDO::FETCH_ASSOC);
                if(count($result) > 0){
                    $isSilverFound = true;
                    $campaign['resources'][self::SILVER] = $result;
                }


                $sql = $conn->prepare("SELECT * from resources
                                       WHERE campaign_id =:campaignId
                                       AND
                                       package_id =:packageId
                                       AND  NOT EXISTS
                                        (
                                            SELECT  *
                                            FROM    campaign_rotation
                                            WHERE   campaign_rotation.user_id =:userId
                                            AND     campaign_rotation.package_id =:packageId
                                            AND     campaign_rotation.campaign_id =:campaignId
                                        )
                                       ");
                $packageId = self::GOLD_ID;
                $sql->bindParam('packageId', $packageId);
                $sql->bindParam('campaignId', $campaign['id']);
                $sql->bindParam('userId', $user_id);
                $sql->execute();
                $result = $sql->fetchAll(PDO::FETCH_ASSOC);
                if(count($result) > 0){
                    $isGoldFound = true;
                    $campaign['resources'][self::GOLD] = $result;
                }


                $sql = $conn->prepare("SELECT * from resources
                                       WHERE campaign_id =:campaignId
                                       AND
                                       package_id =:packageId
                                       AND NOT EXISTS
                                        (
                                            SELECT  *
                                            FROM    campaign_rotation
                                            WHERE   campaign_rotation.user_id =:userId
                                            AND     campaign_rotation.package_id =:packageId
                                            AND     campaign_rotation.campaign_id =:campaignId
                                        )
                                       ");
                $packageId = self::VIDEO_ID;
                $sql->bindParam('packageId', $packageId);
                $sql->bindParam('campaignId', $campaign['id']);
                $sql->bindParam('userId', $user_id);
                $sql->execute();
                $result = $sql->fetchAll(PDO::FETCH_ASSOC);
                if(count($result) > 0){
                    $isVideoFound = true;
                    $campaign['resources'][self::VIDEO] = $result;
                }




            }

        }

        $needToInit = false;
       // TODO REMOVE EMPTY CAMPAIGNS !
        if(!$isBronzeFound){
            self::deleteUserPackageRotation($user_id , self::BRONZE_ID);
            $needToInit = true;
        }
        if(!$isSilverFound){
            self::deleteUserPackageRotation($user_id , self::SILVER_ID);
            $needToInit = true;
        }
        if(!$isGoldFound){
            self::deleteUserPackageRotation($user_id , self::GOLD_ID);
            $needToInit = true;
        }
        // TODO
        /*
        if(!$isVideoFound){
            self::deleteUserPackageRotation($user_id , self::VIDEO_ID);
            $needToInit = true;
        }
        */


        if($needToInit){
            self::getUserDetails($user_id);
        }else{
            return $user;
            exit;
        }



    }

    public static function bannerClick($data){

        $conn = self::connectToDb();
        $campaign_id = $data['campaign_id'];
        $package_id = $data['package_id'];



        $sql = $conn->prepare("SELECT * from `campaigns_type` WHERE id=:packageId");
        $sql->bindParam('packageId', $package_id);
        $sql->execute();
        $result = $sql->fetch(PDO::FETCH_ASSOC);
        $clickValue = $result['click_value'];

        $sql = "UPDATE `campaign_packages` SET current_spent = current_spent + $clickValue WHERE campaign_id=$campaign_id AND type_id=$package_id";
        $stmt = $conn->query($sql);
        //$stmt->execute();
        //$result = $stmt->fetch();
        var_dump($result); exit;
        return $result; exit;

    }

    private static function deleteUserPackageRotation($userId , $packageId){
        var_dump("Delete ".$packageId." PAckage");
        $conn = self::connectToDb();
        $sql = "DELETE FROM campaign_rotation WHERE package_id =".$packageId." AND user_id=".$userId;
        $q = $conn->query($sql);
        var_dump($q);
        return $q;
    }

    public static function updateCampaignRotation($data){

        $dataArray = array();
        $dataArray['user_id'] = $data['user_id'];
        $dataArray['campaign_id'] = $data['campaign_id'];
        $dataArray['package_id'] = $data['package_id'];
        return self::insertToDb('campaign_rotation' , $dataArray);
        exit;
    }




    /* END of Extension Section */

    /* Generic Section */

	public static function insertToDb($tableName, $data) {
		// Convert The Data from Object to Key - Value Array
		$dataArray = (array) $data;
		// Get Last Item Key
		$last_key = end(array_keys($dataArray));
		$sql = array();
		$cols = "(";
		$values = "(";
		foreach ($dataArray AS $k => $v) {
			$cols.= $k;
			$values.= ':' . $k;
			if ($k == $last_key) {
				
			} else {
				$cols.=",";
				$values.=",";
			}
		}
		$cols.=")";
		$values.= ")";

		$query = "INSERT INTO " . $tableName . " " . $cols . " VALUES " . $values;
		$conn = self::connectToDb();
		$q = $conn->prepare($query);
		$q->execute($dataArray);
		return array('id' => $conn->lastInsertId(), 'creation_date' => date("Y-m-d H:i:s", time()));
	}

    private static function deleteFromDb($table , $whereCol , $whereVal){
        $conn = self::connectToDb();
        if($whereCol == null){
            $sql = "DELETE FROM ".$table;
            $q = $conn->query($sql);
            return $q;
        }else{
            $sql = "DELETE FROM ".$table." WHERE ".$whereCol."=".$whereVal;
            $q = $conn->query($sql);
            return $q;
        }


    }

    /* End Of Generic Section */

}

?>