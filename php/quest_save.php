<?php
	if(!$_POST) {
		http_response_code(22404001);
		return;
	}

	$users = array_keys(json_decode(file_get_contents('../.htpasswd'), true));
	$username = $_COOKIE["md5username"];
	$user = "ERROR 404";
	if(!$username)
		$username = $_SESSION['md5username'];
	foreach($users as $u)
		if($username == md5($u))
			$user = $u;

	$dungeons = json_decode(file_get_contents("../data/dungeons.data"), true);


	$x = json_decode($_POST["x"], true);
	$newDungeon = array(
		"id"=>$x["id"],
		"title"=>$x["title"],
		"description"=>$x["description"],
		"completed"=>$x["completed"],
		"dm"=>$x["dm"]
	);

	if($x["id"] == "new") {
		$newDungeon["id"]= time();
		$newDungeon["dm"]= $user;
		echo $newDungeon["id"];
		array_push($dungeons, $newDungeon);
	} else {
		for($i = 0; $i < count($dungeons); $i++) {
			if($dungeons[$i]["id"]==$x["id"]) {
				if(md5($dungeons[$i]["dm"]) != $_COOKIE["md5username"]) {
					return;
				}
	
				$dungeons[$i]["title"] = $x["title"];
				$dungeons[$i]["description"] = $x["description"];
				$dungeons[$i]["completed"] = $x["completed"];
			}
		}
	}

	file_put_contents("../data/dungeons.data", json_encode($dungeons));


?>