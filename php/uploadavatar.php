<?php
	$username = $_COOKIE["md5username"];
if($username) {
	if(!is_dir("../data/".$username."/images/"))
		mkdir("../data/".$username."/images/", 0777, true);
	$filePath = "data/".$username."/images/".$_POST["id"].".img";
	if(is_file("../".$filePath))
		unlink("../".$filePath);
	if(!move_uploaded_file($_FILES["img"]["tmp_name"], "../".$filePath)) {
		echo "upload error!";
	}
	echo $filePath;
} else {
	echo "error";
}

?>