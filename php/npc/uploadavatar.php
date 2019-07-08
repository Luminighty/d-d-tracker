<?php
$username = $_COOKIE["md5username"];
if($username) {

	if(!is_dir("../../data/NPCs/".$_POST["id"]."/"))
		mkdir("../../data/NPCs/".$_POST["id"], 0777, true);
	$filePath = "data/NPCs/".$_POST["id"]."/".$_POST["imgId"].".img";
	if(is_file("../../".$filePath))
		unlink("../../".$filePath);
	if(!move_uploaded_file($_FILES["img"]["tmp_name"], "../../".$filePath)) {
		echo "upload error!";
	}
	echo $filePath;

} else {
	echo "error";
}

?>