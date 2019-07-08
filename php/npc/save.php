<?php
$obj;
if(!$_COOKIE["md5username"]) {
	echo "Username not found!";
	return;

}
if($_POST["x"] == "NEW") {
	$obj = json_decode(file_get_contents("../../data/default.npc"), true);

	$id = time();

	$users = array_keys(json_decode(file_get_contents('../../.htpasswd'), true));
	$username = $_COOKIE["md5username"];
	$user = null;
	foreach($users as $u)
		if($username == md5($u))
			$user = $u;

	$obj["user"] = $user;
	$obj["md5"] = $_COOKIE["md5username"];
	$obj["id"] = $id;
	$path = "../../data/NPCs/".$obj["id"]."/";
	if(!file_exists($path))
		mkdir($path, 0777, true);

	copy("../../data/defaultNPCAvatar.png", $path."avatar.img");
	echo $id;
} else {
	$obj = json_decode($_POST["x"], true);
}
$path = "../../data/NPCs/".$obj["id"]."/";
if(!file_exists($path))
	mkdir($path, 0777, true);
file_put_contents($path."data.npc", json_encode($obj));

//	Delete unused Images

$images = array_diff(scandir($path), array('..', '.', "data.npc", "avatar.img"));

foreach($images as $i) {
	if(!in_array($i, $obj["images"])) {
		echo $i." deleted.";
		unlink($path.$i);
	}
}

?>