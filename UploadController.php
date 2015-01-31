<?php
require_once 'server/db/manager.php';

const SMALL_IMAGE = 'SMALL_IMAGE';
const MEDIUM_IMAGE = 'MEDIUM_IMAGE';
const SMALL_IMAGE_WIDTH = 9;
const SMALL_IMAGE_HEIGHT = 5;


$fname = $_POST["fname"];
$company_id = $_POST["company_id"];
$package_id = $_POST["package_id"];
$campaign_id = $_POST["campaign_id"];
$width = $_POST["width"];
$height = $_POST["height"];
$type = $_POST["type"];
$resource = $_POST["resource"];
$action = $_POST["action"];

// TODO - DELETE EXISTS IMAGES


if(isset($_FILES['file'])){
    //The error validation could be done on the javascript client side.
    $errors= array();        
    $file_name = $_FILES['file']['name'];
    $file_size =$_FILES['file']['size'];
    $file_tmp =$_FILES['file']['tmp_name'];
    $file_type=$_FILES['file']['type'];  
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $extensions = array("jpeg","jpg","png");        
    if(in_array($file_ext,$extensions )=== false){
     $errors[]="image extension not allowed, please choose a JPEG or PNG file.";
    }
    if($file_size > 2097152){
    $errors[]='File size cannot exceed 2 MB';
    }               
    if(empty($errors)==true){
        if (!file_exists("static/images/".$company_id."/".$campaign_id."/".$package_id."/".$type)) {
            mkdir("static/images/".$company_id."/".$campaign_id."/".$package_id."/".$type, 0777, true);
        }else{

        }
        move_uploaded_file($file_tmp,"static/images/".$company_id."/".$campaign_id."/".$package_id."/".$type."/".$file_name);
        echo $fname . " uploaded file: " . "static/images/".$company_id."/".$file_name;
    }else{
        print_r($errors);
    }
}else{
	var_dump("FAIL");
}

?>
