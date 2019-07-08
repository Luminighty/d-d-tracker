<?php
	
	if(!$_POST) {
		return;
	}
	$dungeons = json_decode(file_get_contents("../data/dungeons.data"), true);
	for($i = 0; $i < count($dungeons); $i++) {
		$d = $dungeons[$i];
		if($d["id"]==$_POST["id"]) {
			if(md5($d["dm"]) != $_COOKIE["md5username"]) {
				echo '<p style="color:red; font-weight: bold;">!!!ERROR!!!</p>';
				var_dump($d);
				var_dump($_COOKIE["md5username"]);
				return;
			}
			
		//Delete dungeon
		
		array_splice($dungeons, $i, 1);
		file_put_contents("../data/dungeons.data", json_encode($dungeons));
		return;

		}
	}

	echo '<p style="color:red; font-weight: bold;">!!!ERROR!!!</p>';
	echo "Dungeon Not found!";
	var_dump($_POST);

?>