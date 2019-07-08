<?php
	$errors = array();
	$errors["isError"] = false;
	$errors["list"] = array();
	$page = @file_get_contents($_GET["url"]);
	if($page === false) {
		$errors["isError"] = true;
		array_push($errors["list"], "URL not found.");
		echo json_encode($errors);
		return;
	}
	preg_match_all('/"attributes":(.*)};/', $page, $matches, PREG_PATTERN_ORDER);
	$wholedata = json_decode($matches[1][0], true);
	$data = $wholedata["c"];
	$data["n"] = $wholedata["n"];
	$data["data-Actions"] = json_decode($data["data-Actions"], true);
	$data["data-Traits"] = json_decode($data["data-Traits"], true);
	$data["data-Legendary Actions"] = json_decode($data["data-Legendary Actions"], true);
	$data["data-Reactions"] = json_decode($data["data-Reactions"], true);
	if($_GET["dump"]) {
		var_dump($data);
	} else {
		echo json_encode($data);
	}
?>
