<?php

	$npc = json_decode(file_get_contents("../../data/NPCs/".$_POST['x']."/data.npc"), true);
	if($npc["md5"] != $_COOKIE["md5username"])
		return;

	$files = array_diff(scandir("../../data/NPCs/".$_POST['x']), array('..', '.'));
	foreach($files as $f)
		unlink("../../data/NPCs/".$_POST['x']."/".$f);
	rmdir("../../data/NPCs/".$_POST['x']);
?>