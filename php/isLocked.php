<?php
	$LockFile = json_decode(file_get_contents("../lock"), true);
	$onWhiteList = false;
	foreach($LockFile["whitelist"] as $user)
		$onWhiteList = $onWhiteList || (md5($user) == $_COOKIE["md5username"]);
	echo (!$LockFile["isLocked"] || $onWhiteList) ? "true" : "false";
	echo ($LockFile["isLocked"]) ? "true" : "false";
?>