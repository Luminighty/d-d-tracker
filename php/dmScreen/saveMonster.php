<?php

	$m = $_POST["monster"];
	$id = $m["id"];
	$name = $m["name"];
	file_put_contents("../../data/monsters/".$id."_".$name.".monster", json_encode($m), LOCK_EX);

?>