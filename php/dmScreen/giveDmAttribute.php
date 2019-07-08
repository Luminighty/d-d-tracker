<?php
	if(!$_COOKIE["md5username"]) {
	echo "Username not found!";
	return;
	}
	$path = "../../data/".$_COOKIE["md5username"]."/";
	$settings = json_decode(file_get_contents($path."user.settings"), true);
	$settings["isDm"] = true;
	if(!file_exists($path))
		mkdir($path, 0777, true);
	file_put_contents($path."user.settings", json_encode($settings), LOCK_EX);


?>