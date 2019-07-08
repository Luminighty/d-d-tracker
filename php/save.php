<?php
$obj = null;
if($_POST["x"] == "NEW") {
	$obj = json_decode(file_get_contents("../data/default.chr"), false);
	$obj->username = $_POST["user"];
	$path = "../data/".$obj->username."/";
	if(!file_exists($path))
		mkdir($path, 0777, true);
	$id = time();

	$chars = array_diff(scandir($path), array('..', '.'));
	mkdir($path."/images/");
	copy("../data/defaultAvatar.png", $path."/images/".$id.".img");
	$obj->id = $id;
	echo $id;
} else {
	$obj = json_decode($_POST["x"], false);
	if($obj->username != $_COOKIE["md5username"])
		return;
}
$path = "../data/".$obj->username."/";
if(!file_exists($path))
	mkdir($path, 0777, true);
file_put_contents($path.$obj->id.".chr", json_encode($obj), LOCK_EX);

?>