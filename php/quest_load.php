<?php
	if(!$_POST) {
		echo "No POST";
		return;
	}
	$dungeons = json_decode(file_get_contents("../data/dungeons.data"), true);
	foreach($dungeons as $d) {
		if($d["id"]==$_POST["id"]) {
			if(md5($d["dm"]) != $_COOKIE["md5username"]) {
				echo "Dm does not match!";
				return;
			}
			echo json_encode($d);
		}
	}
?>