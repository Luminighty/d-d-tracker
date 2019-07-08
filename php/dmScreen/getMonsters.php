<?php
	
	$monsterFiles = glob("../../data/monsters/*.monster");

	$monsters = array();
	foreach($monsterFiles as $f) {
		preg_match_all('/([0-9]*)_(.*).monster/', $f, $data, PREG_PATTERN_ORDER);
		$monsters[((string)$data[1][0])] = json_decode(file_get_contents($f), true);
	}
	echo json_encode($monsters);
?>